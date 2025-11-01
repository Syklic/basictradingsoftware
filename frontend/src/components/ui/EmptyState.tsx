import { ReactNode } from 'react'

export interface EmptyStateAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  icon?: ReactNode
}

export interface EmptyStateProps {
  // Primary content
  title: string
  description: string
  icon?: ReactNode

  // Visual
  size?: 'sm' | 'md' | 'lg'
  background?: 'subtle' | 'bold'

  // Actions
  actions?: EmptyStateAction[]

  // Secondary content
  tip?: string
  progress?: number // 0-100 for loading states
  metadata?: Record<string, string>
}

export default function EmptyState({
  title,
  description,
  icon,
  size = 'md',
  background = 'subtle',
  actions,
  tip,
  progress,
  metadata,
}: EmptyStateProps) {
  const iconSizeClass = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }[size]

  return (
    <div className="flex items-center justify-center h-full py-12">
      <div className={`text-center max-w-md ${background === 'bold' ? 'bg-muted p-8 rounded-lg' : ''}`}>
        {/* Icon */}
        {icon && (
          <div className={`flex justify-center mb-4 text-muted-foreground`}>
            <div className={iconSizeClass}>
              {icon}
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mb-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{progress}% Complete</p>
          </div>
        )}

        {/* Metadata */}
        {metadata && Object.keys(metadata).length > 0 && (
          <div className="mb-4 space-y-1 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4">
                <span className="font-medium">{key}:</span>
                <span className="font-mono">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  action.variant === 'primary'
                    ? 'bg-accent text-accent-foreground hover:opacity-90 active:scale-95'
                    : 'bg-muted hover:bg-muted/80 active:scale-95'
                }`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Tip */}
        {tip && (
          <p className="text-xs text-muted-foreground italic pt-3 border-t border-border">{tip}</p>
        )}
      </div>
    </div>
  )
}
