import { useNavigationStore, VIEW_LABELS, VIEW_DESCRIPTIONS, VIEW_ICONS, type ViewType } from '../../store/navigationStore'
import * as Icons from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  id: ViewType
  label: string
  description: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Overview of everything',
    icon: 'LayoutDashboard',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    description: 'Your positions & P&L',
    icon: 'Briefcase',
  },
  {
    id: 'trade-execution',
    label: 'Trade Execution',
    description: 'Place orders quickly',
    icon: 'Zap',
  },
  {
    id: 'signals-strategy',
    label: 'Signals & Strategy',
    description: 'ML insights & signals',
    icon: 'TrendingUp',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Performance & analysis',
    icon: 'BarChart3',
  },
  {
    id: 'watchlists',
    label: 'Watchlists',
    description: 'Monitor assets',
    icon: 'Eye',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Preferences & config',
    icon: 'Settings',
  },
]

const getIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    LayoutDashboard: <Icons.LayoutDashboard className="h-5 w-5" />,
    Briefcase: <Icons.Briefcase className="h-5 w-5" />,
    Zap: <Icons.Zap className="h-5 w-5" />,
    TrendingUp: <Icons.TrendingUp className="h-5 w-5" />,
    BarChart3: <Icons.BarChart3 className="h-5 w-5" />,
    Eye: <Icons.Eye className="h-5 w-5" />,
    Settings: <Icons.Settings className="h-5 w-5" />,
  }
  return iconMap[iconName] || null
}

export default function MultiViewNav() {
  const [isExpanded, setIsExpanded] = useState(true)
  const currentView = useNavigationStore((state) => state.currentView)
  const setView = useNavigationStore((state) => state.setView)

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col pt-20 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-20 -right-3 p-1 bg-card border border-border rounded-full hover:bg-muted transition-colors"
        title={isExpanded ? 'Collapse' : 'Expand'}
      >
        <Icons.ChevronLeft
          className={`h-4 w-4 transition-transform ${
            isExpanded ? 'rotate-0' : 'rotate-180'
          }`}
        />
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left group ${
                isActive
                  ? 'bg-accent text-accent-foreground shadow-lg'
                  : 'hover:bg-muted text-foreground'
              }`}
              title={isExpanded ? undefined : item.label}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">{getIcon(item.icon)}</div>

              {/* Labels (collapsed when sidebar is narrow) */}
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs opacity-75 truncate">
                    {item.description}
                  </div>
                </div>
              )}

              {/* Indicator for active item */}
              {isActive && !isExpanded && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-foreground rounded-r" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer hint */}
      {isExpanded && (
        <div className="p-3 border-t border-border text-xs text-muted-foreground">
          <p className="mb-2">💡 Tip: Press Ctrl+K for quick commands</p>
        </div>
      )}
    </aside>
  )
}
