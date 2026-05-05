import PhoneApp from './components/PhoneApp.jsx';

export default function App() {
  // Configuration is forwarded to the legacy phone.js as `window.phoneOptions`.
  // See the original Phone/index.html for the full list of supported options.
  const phoneOptions = {
    loadAlternateLang: true,
    // wssServer: 'pbx.example.com',
    // WebSocketPort: 8089,
    // ServerPath: '/ws',
    // SipDomain: 'pbx.example.com',
    // SipUsername: '100',
    // SipPassword: 'secret',
  };

  // Optional web hooks fired by phone.js. Provide handlers as needed.
  const webHooks = {
    web_hook_on_init: () => console.log('[phone] init'),
    web_hook_on_register: (ua) => console.log('[phone] registered', ua),
    web_hook_on_invite: (session) => console.log('[phone] invite', session),
    web_hook_on_terminate: (session) => console.log('[phone] terminate', session),
  };

  return <PhoneApp phoneOptions={phoneOptions} webHooks={webHooks} />;
}
