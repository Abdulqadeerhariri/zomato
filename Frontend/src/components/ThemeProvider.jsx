import { useEffect, useState } from 'react'
import { ThemeContext } from './ThemeContext'

const THEME_STORAGE_KEY = 'zomato-theme'

const getSavedTheme = () => {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getSavedTheme)
  const [systemTheme, setSystemTheme] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemTheme = (event) => setSystemTheme(event.matches ? 'dark' : 'light')

    mediaQuery.addEventListener('change', updateSystemTheme)
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [])

  const activeTheme = theme ?? systemTheme

  useEffect(() => {
    document.documentElement.dataset.theme = activeTheme
  }, [activeTheme])

  const toggleTheme = () => {
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark'
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    setTheme(nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ activeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
