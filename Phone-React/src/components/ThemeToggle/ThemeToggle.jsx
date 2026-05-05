import IconButton from '../IconButton';
import { useTheme } from '../../contexts/ThemeContext.jsx';

/**
 * ThemeToggle — flips between light & dark themes.
 * Uses IconButton so it adopts the current theme automatically.
 */
export default function ThemeToggle({ size = 'md' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <IconButton
      icon={isDark ? 'fa fa-sun-o' : 'fa fa-moon-o'}
      label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      size={size}
      onClick={toggleTheme}
    />
  );
}
