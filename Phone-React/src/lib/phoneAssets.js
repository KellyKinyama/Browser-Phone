// Centralized list of legacy assets the embedded jQuery phone needs.
// All paths are served from /public.

export const PHONE_STYLESHEETS = [
  '/lib/Normalize/normalize-v8.0.1.css',
  '/lib/fonts/font_roboto/roboto.css',
  '/lib/fonts/font_awesome/css/font-awesome.min.css',
  '/lib/jquery/jquery-ui-1.13.2.min.css',
  '/lib/Croppie/croppie.css',
  '/phone.css',
];

// Order matters: jQuery must run first, phone.js last.
export const PHONE_SCRIPTS = [
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

// Marker attribute used for cleanup on unmount.
export const ASSET_MARKER = 'data-browser-phone';
