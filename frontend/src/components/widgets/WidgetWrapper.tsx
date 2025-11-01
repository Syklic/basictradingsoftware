import { ReactNode } from 'react'
import { Settings } from 'lucide-react'

interface WidgetWrapperProps {
  title: string
  children: ReactNode
  onSettings?: () => void
  icon?: ReactNode
  isLoading?: boolean
}

export default function WidgetWrapper({
  title,
  children,
  onSettings,
  icon,
  isLoading,
}: WidgetWrapperProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        {onSettings && (
          <button
            onClick={onSettings}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
            title="Widget settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-24 text-muted-foreground">
            <div className="animate-spin h-5 w-5">⏳</div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
