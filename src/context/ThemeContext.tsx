'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    return (localStorage.getItem('webapp-theme') as Theme) || 'light'
  } catch {
    return 'light'
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)

  const applyTheme = useCallback((newTheme: Theme) => {
    let effective: 'light' | 'dark' = 'light'
    if (newTheme === 'system') {
      effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      effective = newTheme
    }
    document.documentElement.setAttribute('data-theme', effective)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setThemeState(newTheme)
    localStorage.setItem('webapp-theme', newTheme)
    applyTheme(newTheme)
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('webapp-theme', newTheme)
    applyTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
