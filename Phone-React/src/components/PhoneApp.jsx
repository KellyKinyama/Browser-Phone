import { useEffect, useRef, useState } from 'react';

// All libraries are served locally from /public/lib (copied from ../lib).
const STYLESHEETS = [
  '/lib/Normalize/normalize-v8.0.1.css',
  '/lib/fonts/font_roboto/roboto.css',
  '/lib/fonts/font_awesome/css/font-awesome.min.css',
  '/lib/jquery/jquery-ui-1.13.2.min.css',
  '/lib/Croppie/croppie.css',
  '/phone.css',
];

// Scripts that must be loaded sequentially (jQuery first, then jQuery UI, then phone.js).
const SEQUENTIAL_SCRIPTS = [
  '/lib/jquery/jquery-3.6.1.min.js',
  '/lib/jquery/jquery-ui-1.13.2.min.js',
  '/lib/SipJS/sip-0.20.0.min.js',
  '/lib/jquery/jquery.md5-min.js',
  '/lib/Chart/Chart.bundle-2.7.2.min.js',
  '/lib/FabricJS/fabric-2.4.6.min.js',
  '/lib/Moment/moment-with-locales-2.24.0.min.js',
  '/lib/Croppie/croppie-2.6.4.min.js',
  '/lib/XMPP/strophe-1.4.1.umd.min.js',
  '/phone.js',
];

// (No deferred scripts — phone.js expects the libs to be available immediately.)
const DEFERRED_SCRIPTS = [];

const MARKER_ATTR = 'data-browser-phone';

function injectStylesheet(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = href;
  link.setAttribute(MARKER_ATTR, 'css');
  document.head.appendChild(link);
  return link;
}

function injectScript(src, { defer = false } = {}) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    if (defer) script.defer = true;
    script.setAttribute(MARKER_ATTR, 'js');
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

export default function PhoneApp({ phoneOptions = {}, webHooks = {} }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    // 1. Expose configuration + hooks on window BEFORE phone.js runs.
    window.phoneOptions = { ...(window.phoneOptions || {}), ...phoneOptions };
    Object.entries(webHooks).forEach(([name, fn]) => {
      if (typeof fn === 'function') window[name] = fn;
    });

    // 2. Service worker (optional; the legacy app registers /sw.js).
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
    }

    // 3. Inject stylesheets.
    const links = STYLESHEETS.map(injectStylesheet);

    // 4. Load core scripts sequentially, then the deferred extras in parallel.
    (async () => {
      try {
        for (const src of SEQUENTIAL_SCRIPTS) {
          if (cancelled) return;
          await injectScript(src);
        }
        await Promise.all(DEFERRED_SCRIPTS.map((src) => injectScript(src, { defer: true })));
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
      // Best-effort cleanup. Note: phone.js attaches many global handlers and
      // is not designed to be torn down — a full page reload is the safest reset.
      document.querySelectorAll(`[${MARKER_ATTR}]`).forEach((el) => el.remove());
      links.forEach((l) => l.remove());
    };
    // Mount once. Re-running would double-load jQuery/phone.js.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {status === 'loading' && (
        <div className="loading">
          <span className="fa fa-circle-o-notch fa-spin" />
          <p style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>Loading Browser Phone…</p>
        </div>
      )}
      {status === 'error' && (
        <div style={{ padding: 24, fontFamily: 'sans-serif', color: '#b00' }}>
          <h2>Failed to load phone</h2>
          <pre>{error}</pre>
        </div>
      )}

      {/* Mount point that the legacy phone.js renders into. */}
      <div id="Phone" ref={containerRef} />
    </>
  );
}
