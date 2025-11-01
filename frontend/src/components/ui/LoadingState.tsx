import { Activity } from 'lucide-react'

interface LoadingStateProps {
  title?: string
  items?: string[]
}

export default function LoadingState({ title = 'Loading', items }: LoadingStateProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-5 w-5 text-accent animate-spin" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent/50 animate-pulse"
            style={{
              animation: 'slideRight 1.5s ease-in-out infinite',
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Loading dashboard data...</p>
      </div>

      {/* Loading Items */}
      {items && items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Default items if none provided */}
      {!items && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0s' }} />
            <span>Portfolio data</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span>Recent orders</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 rounded-full animate-pulse" />
            <span>Trading signals</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 rounded-full animate-pulse" />
            <span>Market data</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideRight {
          0% {
            width: 0;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0;
          }
        }
      `}</style>
    </div>
  )
}
