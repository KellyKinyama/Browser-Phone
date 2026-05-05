import useLegacyPhone from '../../lib/useLegacyPhone';
import Loading from '../Loading';
import ErrorBanner from '../ErrorBanner';
import styles from './PhoneApp.module.scss';

/**
 * PhoneApp — React shell that hosts the legacy jQuery-based phone.js.
 *
 * Props:
 *   phoneOptions — forwarded to `window.phoneOptions` before phone.js runs.
 *                  See ../../../public/phone.js for the supported keys.
 *   webHooks     — map of `web_hook_*` callbacks, attached to window.
 */
export default function PhoneApp({ phoneOptions, webHooks }) {
  const { status, error } = useLegacyPhone({ phoneOptions, webHooks });

  return (
    <div className={styles.shell}>
      {status === 'loading' && <Loading label="Loading Browser Phone…" />}
      {status === 'error' && <ErrorBanner title="Failed to load phone" message={error} />}

      {/* Mount node that the legacy phone.js renders into. */}
      <div id="Phone" className={styles.mount} />
    </div>
  );
}
