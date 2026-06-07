'use client'

import { AppProvider } from '@/context/AppContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AppShell } from '@/components/AppShell'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppShell>{children}</AppShell>
      </AppProvider>
    </ThemeProvider>
  )
}
