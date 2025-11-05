import { useEffect, useState } from 'react'
import { Activity, Search, Moon, Sun, Bell, User, Palette, Settings, Edit3 } from 'lucide-react'
import LayoutSwitcher from './LayoutSwitcher'
import WidgetManager from './WidgetManager'
import LayoutBuilder from './LayoutBuilder'
import { useLayoutStore } from '../store/layoutStore'

interface NavbarProps {
  isConnected: boolean
  sidebarCollapsed?: boolean
  onThemeOpen?: () => void
  onSettingsOpen?: () => void
}

export default function Navbar({ isConnected, sidebarCollapsed = false, onThemeOpen, onSettingsOpen }: NavbarProps) {
  const [isDark, setIsDark] = useState(false)
  const [showWidgetManager, setShowWidgetManager] = useState(false)
  const editMode = useLayoutStore((state) => state.editMode)
  const setEditMode = useLayoutStore((state) => state.setEditMode)

  // Load theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = saved ? saved === 'dark' : prefersDark
    setIsDark(shouldBeDark)
    applyTheme(shouldBeDark)
  }, [])

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
    applyTheme(newIsDark)
  }

  return (
    <>
      <nav
        className={`fixed top-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-6 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'left-20' : 'left-64'
        }`}
      >
        {/* Left Section - Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets..."
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            />
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center gap-3 ml-4">
          {/* Layout Switcher */}
          <LayoutSwitcher />

          {/* Customize Dashboard Button */}
          <button
            onClick={() => setShowWidgetManager(true)}
            className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium"
            title="Customize dashboard widgets"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Customize</span>
          </button>

          {/* Edit Layout Button */}
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              editMode
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
            title="Edit layout positions and sizes"
          >
            <Edit3 className="h-4 w-4" />
            <span className="hidden sm:inline">{editMode ? 'Done' : 'Edit'}</span>
          </button>

          {/* Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
            <div
              className={`h-2 w-2 rounded-full animate-pulse ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>

          {/* Notifications */}
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* Theme Customizer */}
          <button
            onClick={onThemeOpen}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Customize theme"
          >
            <Palette className="h-5 w-5" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Profile */}
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors ml-2"
            aria-label="User profile"
          >
            <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
              U
            </div>
          </button>
        </div>
      </nav>

      {/* Widget Manager Modal */}
      {showWidgetManager && (
        <WidgetManager onClose={() => setShowWidgetManager(false)} />
      )}

      {/* Layout Builder Modal */}
      {editMode && <LayoutBuilder />}
    </>
  )
}
