import { useTheme } from './ThemeContext'

const ThemeToggle = () => {
  const { activeTheme, toggleTheme } = useTheme()
  const isDark = activeTheme === 'dark'

  return (
    <button
      className="theme-toggle"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-icon theme-toggle-sun" aria-hidden="true">☼</span>
      <span className="theme-toggle-icon theme-toggle-moon" aria-hidden="true">☾</span>
      <span className="theme-toggle-thumb" />
    </button>
  )
}

export default ThemeToggle
