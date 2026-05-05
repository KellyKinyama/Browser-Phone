import { NativePhone } from './components';
import { ThemeProvider } from './contexts';
import { loadSettings } from './lib/phoneSettings';

export default function App() {
  // Merge any user-saved SIP credentials over the static defaults.
  // The settings modal (gear icon) writes to localStorage and reloads.
  const phoneOptions = {
    loadAlternateLang: true,
    ...loadSettings(),
  };

  return (
    <ThemeProvider>
      <NativePhone phoneOptions={phoneOptions} />
    </ThemeProvider>
  );
}



