import { ASSET_MARKER } from './phoneAssets';

export function injectStylesheet(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = href;
  link.setAttribute(ASSET_MARKER, 'css');
  document.head.appendChild(link);
  return link;
}

export function injectScript(src, { defer = false } = {}) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    if (defer) script.defer = true;
    script.setAttribute(ASSET_MARKER, 'js');
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

export function removeInjectedAssets() {
  document.querySelectorAll(`[${ASSET_MARKER}]`).forEach((el) => el.remove());
}
