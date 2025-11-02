import {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  Zap,
  BarChart3,
  List,
  Settings,
} from 'lucide-react'

interface MobileBottomNavProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

/**
 * Mobile Bottom Navigation
 * Touch-optimized navigation bar for mobile devices
 */
export default function MobileBottomNav({
  activeSection,
  onSectionChange,
}: MobileBottomNavProps) {
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'signals', label: 'Signals', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'watchlist', label: 'Watchlist', icon: List },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-pb"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex justify-around overflow-x-auto">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`flex flex-col items-center justify-center py-2 px-2 md:px-4 flex-1 min-w-max transition-colors active:scale-95 ${
              activeSection === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label={label}
            aria-current={activeSection === id ? 'page' : undefined}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium line-clamp-1">{label}</span>

            {activeSection === id && (
              <div className="absolute -top-1 h-1 w-8 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
