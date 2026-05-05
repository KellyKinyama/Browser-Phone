# Browser Phone — Vite + React wrapper

This subproject wraps the original [`../Phone`](../Phone) jQuery-based Browser Phone application inside a Vite + React JS shell so it can be developed, built, and deployed with modern tooling.

## What this does (and doesn't) do

The legacy `phone.js` (~700 KB) is a tightly coupled jQuery / SIP.js / FabricJS / Strophe app that bootstraps on `$(document).ready` into `<div id="Phone">` and drives the entire UI imperatively. Rewriting it as idiomatic React components would be a multi-month effort.

This project instead:

- ✅ Provides a Vite + React JS dev server, build, and preview pipeline.
- ✅ Renders a React `PhoneApp` component that owns the `#Phone` mount node.
- ✅ Loads jQuery, jQuery UI, SIP.js, FabricJS, Moment, Croppie, Strophe, Chart.js, and `phone.js` in the correct order.
- ✅ Exposes `phoneOptions` and `web_hook_*` handlers via React props, attached to `window` before `phone.js` runs.
- ✅ Serves all original static assets (`phone.css`, `lang/`, `icons/`, `media/`, `avatars/`, `manifest.json`, `sw.js`, wallpapers, favicon) from `public/` so existing relative paths inside `phone.js` keep working.
- ⚠️ Does **not** rewrite the legacy DOM/jQuery code into React components. Internal phone UI is still rendered by `phone.js`.
- ⚠️ Hot reloading the `PhoneApp` component will not cleanly tear down the legacy app — refresh the page after editing.

## Project layout

```
Phone-React/
├─ index.html              # Vite entry HTML (mounts <div id="root">)
├─ vite.config.js
├─ package.json
├─ public/                 # Copied verbatim from ../Phone (served at /)
│  ├─ phone.js
│  ├─ phone.css
│  ├─ phone.dark.css
│  ├─ phone.light.css
│  ├─ sw.js
│  ├─ manifest.json
│  ├─ favicon.ico
│  ├─ wallpaper.{light,dark}.webp
│  ├─ lang/, icons/, media/, avatars/
│  └─ ...
└─ src/
   ├─ main.jsx             # React entry
   ├─ App.jsx              # Configures phoneOptions + web hooks
   └─ components/
      └─ PhoneApp.jsx      # Loads CSS + JS deps, renders <div id="Phone">
```

## Getting started

```powershell
cd Phone-React
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve dist/
```

## Configuring the phone

Edit [src/App.jsx](src/App.jsx). The `phoneOptions` object is forwarded to `window.phoneOptions` before `phone.js` boots, so every option supported by the original `Phone/index.html` works here:

```jsx
const phoneOptions = {
  loadAlternateLang: true,
  wssServer: 'pbx.example.com',
  WebSocketPort: 8089,
  ServerPath: '/ws',
  SipDomain: 'pbx.example.com',
  SipUsername: '100',
  SipPassword: 'secret',
  // ...any other option from the original index.html
};
```

The `webHooks` object lets you provide handlers for the `web_hook_*` callbacks (`web_hook_on_init`, `web_hook_on_register`, `web_hook_on_invite`, etc.) — they are attached to `window` before `phone.js` runs.

## Updating the bundled phone.js

When the upstream `../Phone/phone.js` changes, copy it back into `public/`:

```powershell
Copy-Item ..\Phone\phone.js, ..\Phone\phone.css, ..\Phone\phone.dark.css, ..\Phone\phone.light.css, ..\Phone\sw.js, ..\Phone\manifest.json public\ -Force
Copy-Item ..\Phone\lang, ..\Phone\icons, ..\Phone\media, ..\Phone\avatars public\ -Recurse -Force
```

## Roadmap (optional next steps)

If you eventually want a real React port, suggested incremental approach:

1. Move the third-party libs from CDN into npm packages (`jquery`, `sip.js`, `fabric`, `moment`, `chart.js`, `strophe.js`, `croppie`).
2. Extract `phone.js` constants/state into ES modules.
3. Replace one panel at a time (e.g. dial pad → `<DialPad />`) while keeping the rest of the legacy DOM intact.
4. Finally, drop `phone.js` once all UI panels and the SIP/XMPP layer are React/JS-modular.
