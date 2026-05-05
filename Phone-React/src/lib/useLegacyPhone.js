import { useEffect, useState } from 'react';
import { PHONE_SCRIPTS, PHONE_STYLESHEETS } from './phoneAssets';
import { injectScript, injectStylesheet, removeInjectedAssets } from './assetLoader';

/**
 * useLegacyPhone — loads the original phone.js + its dependencies once and
 * exposes provided phoneOptions / web hooks on `window` beforehand.
 *
 * Returns `{ status, error }`:
 *   status: 'idle' | 'loading' | 'ready' | 'error'
 *
 * When `enabled` is false the hook stays in 'idle' and never injects scripts.
 */
export default function useLegacyPhone({ phoneOptions = {}, webHooks = {}, enabled = true } = {}) {
  const [status, setStatus] = useState(enabled ? 'loading' : 'idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      return undefined;
    }

    let cancelled = false;

    // 1. Expose configuration BEFORE phone.js executes.
    window.phoneOptions = { ...(window.phoneOptions || {}), ...phoneOptions };
    Object.entries(webHooks).forEach(([name, fn]) => {
      if (typeof fn === 'function') window[name] = fn;
    });

    // 1b. phone.js reads many values from localStorage at script-parse time
    //     (before our `document.ready` hook can apply phoneOptions). Mirror
    //     credentials into localStorage AND seed first-run flags so InitUi
    //     does not bail out into hidden first-run dialogs.
    try {
      const ls = window.localStorage;
      const SEED_KEYS = [
        'wssServer', 'WebSocketPort', 'ServerPath',
        'SipDomain', 'SipUsername', 'SipPassword',
        'profileName',
      ];
      SEED_KEYS.forEach((key) => {
        const val = phoneOptions[key];
        if (val !== undefined && val !== null && val !== '') {
          ls.setItem(key, String(val));
        }
      });
      // Skip the welcome screen.
      if (ls.getItem('WelcomeScreenAccept') !== 'yes') {
        ls.setItem('WelcomeScreenAccept', 'yes');
      }
      // Seed a profile user id so InitUi does not pop the (hidden) profile dialog.
      if (!ls.getItem('profileUserID')) {
        const uid = (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : `u-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        ls.setItem('profileUserID', uid);
      }
      // Provide a minimal vCard so profile rendering doesn't error.
      if (!ls.getItem('profileVcard')) {
        ls.setItem('profileVcard', JSON.stringify({
          TitleDesc: '', Mobile: '', Email: '', Number1: '', Number2: '',
        }));
      }
    } catch (err) {
      console.warn('[useLegacyPhone] localStorage seed failed:', err);
    }

    // 2. Optional service worker (legacy app registers /sw.js).
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
    }

    // 3. Inject stylesheets.
    PHONE_STYLESHEETS.forEach(injectStylesheet);

    // 4. Load scripts sequentially so all globals exist when phone.js runs.
    (async () => {
      try {
        for (const src of PHONE_SCRIPTS) {
          if (cancelled) return;
          await injectScript(src);
        }
        if (!cancelled) setStatus('ready');
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message);
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
      // Best-effort cleanup. phone.js attaches many global handlers and is
      // not designed to be torn down — a full page reload is the safest reset.
      removeInjectedAssets();
    };
    // Mount once. Re-running would double-load jQuery/phone.js.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { status, error };
}
