import { useNavigationStore, VIEW_LABELS, type ViewType } from '../../store/navigationStore'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs() {
  const breadcrumbs = useNavigationStore((state) => state.breadcrumbs)
  const setView = useNavigationStore((state) => state.setView)
  const currentView = useNavigationStore((state) => state.currentView)

  if (!breadcrumbs || breadcrumbs.length === 0) return null

  return (
    <div className="flex items-center gap-1 px-6 py-3 bg-card border-b border-border text-sm">
      {/* Home button */}
      <button
        onClick={() => setView('dashboard')}
        className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        title="Go to Dashboard"
      >
        <Home className="h-4 w-4" />
      </button>

      {/* Breadcrumb items */}
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="flex items-center gap-1">
          {/* Separator */}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />

          {/* Breadcrumb link */}
          {index === breadcrumbs.length - 1 ? (
            // Current item (not clickable)
            <span className="px-2 py-1 font-medium text-foreground">
              {breadcrumb.label}
            </span>
          ) : (
            // Previous items (clickable)
            <button
              onClick={() => setView(breadcrumb.view, breadcrumb.params?.assetId)}
              className="px-2 py-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {breadcrumb.label}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
