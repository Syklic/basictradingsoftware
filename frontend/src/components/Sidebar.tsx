import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, BarChart3, Zap, TrendingUp, Settings, LogOut, Home } from 'lucide-react'

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '#' },
  { icon: TrendingUp, label: 'Portfolio', href: '#' },
  { icon: BarChart3, label: 'Analytics', href: '#' },
  { icon: Zap, label: 'Signals', href: '#' },
  { icon: Settings, label: 'Settings', href: '#' },
]

export default function Sidebar({ onCollapsedChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setCollapsed(JSON.parse(saved))
    }
  }, [])

  // Save sidebar state whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed))
    onCollapsedChange?.(collapsed)
  }, [collapsed, onCollapsedChange])

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      } flex flex-col`}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && <h1 className="text-lg font-bold truncate">BTS</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-muted rounded-lg transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </a>
        ))}
      </nav>

      {/* Logout / Footer */}
      <div className="border-t border-border p-4">
        <button
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
