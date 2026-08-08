import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'theme'

function applyTheme(mode) {
  const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

export function useTheme() {
  const [theme, setThemeState] = useState(() => localStorage.getItem(STORAGE_KEY) || 'light')

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = useCallback((mode) => {
    localStorage.setItem(STORAGE_KEY, mode)
    setThemeState(mode)
  }, [])

  return { theme, setTheme }
}
