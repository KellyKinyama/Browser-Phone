/**
 * phoneSettings — load/save SIP credentials in localStorage.
 *
 * The legacy phone.js reads its options from `window.phoneOptions` at
 * boot time, so we merge saved values into the props passed to
 * <NativePhone phoneOptions={...} />.
 */

const STORAGE_KEY = 'browser-phone:settings';

export function loadSettings() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSettings(values) {
  if (typeof window === 'undefined') return;
  // Strip empty/blank values so they don't override phone.js defaults.
  const cleaned = {};
  Object.entries(values || {}).forEach(([k, v]) => {
    if (v === '' || v === null || v === undefined) return;
    cleaned[k] = v;
  });
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch (err) {
    console.warn('[phoneSettings] failed to save:', err);
  }
}

export function clearSettings() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Returns true when the minimum fields needed to register are present. */
export function hasRequiredCredentials(values) {
  if (!values) return false;
  return Boolean(values.SipUsername && values.SipPassword && values.SipDomain && values.wssServer);
}
