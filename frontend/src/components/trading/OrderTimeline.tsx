import { CheckCircle2, Circle, Clock, AlertCircle, X } from 'lucide-react'

export type OrderStatus =
  | 'submitted'
  | 'accepted'
  | 'partial-fill'
  | 'filled'
  | 'canceled'
  | 'rejected'
  | 'expired'

interface OrderTimelineStep {
  status: OrderStatus
  label: string
  description: string
  timestamp?: string
  icon: React.ReactNode
}

interface OrderTimelineProps {
  currentStatus: OrderStatus
  steps?: OrderTimelineStep[]
  timestamps?: Record<OrderStatus, string>
}

const DEFAULT_STEPS: OrderTimelineStep[] = [
  {
    status: 'submitted',
    label: 'Submitted',
    description: 'Order placed with broker',
    icon: <Circle className="h-4 w-4" />,
  },
  {
    status: 'accepted',
    label: 'Accepted',
    description: 'Broker validated order',
    icon: <Circle className="h-4 w-4" />,
  },
  {
    status: 'partial-fill',
    label: 'Partial Fill',
    description: 'Partial execution in progress',
    icon: <Circle className="h-4 w-4" />,
  },
  {
    status: 'filled',
    label: 'Filled',
    description: 'Order completely executed',
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
]

const ERROR_STEPS: Record<OrderStatus, OrderTimelineStep> = {
  canceled: {
    status: 'canceled',
    label: 'Canceled',
    description: 'Order was canceled',
    icon: <X className="h-4 w-4" />,
  },
  rejected: {
    status: 'rejected',
    label: 'Rejected',
    description: 'Order was rejected by broker',
    icon: <AlertCircle className="h-4 w-4" />,
  },
  expired: {
    status: 'expired',
    label: 'Expired',
    description: 'Order expired without execution',
    icon: <Clock className="h-4 w-4" />,
  },
  submitted: DEFAULT_STEPS[0],
  accepted: DEFAULT_STEPS[1],
  'partial-fill': DEFAULT_STEPS[2],
  filled: DEFAULT_STEPS[3],
}

export default function OrderTimeline({
  currentStatus,
  steps = DEFAULT_STEPS,
  timestamps = {},
}: OrderTimelineProps) {
  // Determine if current status is an error
  const isError = ['canceled', 'rejected', 'expired'].includes(currentStatus)

  // Build timeline based on current status
  let displaySteps: OrderTimelineStep[] = []

  if (isError) {
    // Show normal steps up to where error occurred
    const normalSteps = DEFAULT_STEPS.filter((s) => {
      const normalOrder = ['submitted', 'accepted', 'partial-fill', 'filled']
      const currentIndex = normalOrder.indexOf(currentStatus)
      return normalOrder.indexOf(s.status) < currentIndex
    })
    displaySteps = [...normalSteps, ERROR_STEPS[currentStatus]]
  } else {
    // Show normal progression
    const statusOrder: OrderStatus[] = ['submitted', 'accepted', 'partial-fill', 'filled']
    const currentIndex = statusOrder.indexOf(currentStatus)
    displaySteps = DEFAULT_STEPS.slice(0, currentIndex + 1)
  }

  const getStepColor = (status: OrderStatus, isActive: boolean, isCompleted: boolean) => {
    if (isError && (status === currentStatus || currentStatus === 'canceled')) {
      return 'text-red-600 dark:text-red-400'
    }
    if (isCompleted) {
      return 'text-green-600 dark:text-green-400'
    }
    if (isActive) {
      return 'text-accent'
    }
    return 'text-muted-foreground'
  }

  const getStepBgColor = (status: OrderStatus, isActive: boolean, isCompleted: boolean) => {
    if (isError && status === currentStatus) {
      return 'bg-red-500/10 border-red-500/30'
    }
    if (isCompleted) {
      return 'bg-green-500/10 border-green-500/30'
    }
    if (isActive) {
      return 'bg-accent/10 border-accent/30'
    }
    return 'bg-muted border-border'
  }

  return (
    <div className="space-y-4 bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold">Order Lifecycle</h3>

      {/* Timeline Steps */}
      <div className="space-y-3">
        {displaySteps.map((step, index) => {
          const isCompleted = displaySteps.length > 1 && index < displaySteps.length - 1
          const isActive = step.status === currentStatus
          const stepColor = getStepColor(step.status, isActive, isCompleted)
          const stepBgColor = getStepBgColor(step.status, isActive, isCompleted)

          return (
            <div key={step.status} className="relative">
              {/* Connector Line */}
              {index < displaySteps.length - 1 && (
                <div
                  className={`absolute left-6 top-12 w-0.5 h-8 ${
                    isCompleted
                      ? 'bg-green-500/30'
                      : isActive
                        ? 'bg-accent/30'
                        : 'bg-border'
                  }`}
                />
              )}

              {/* Step Card */}
              <div
                className={`border rounded-lg p-3 flex gap-3 relative z-10 ${stepBgColor}`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 mt-0.5 ${stepColor}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="font-semibold text-sm">{step.label}</div>
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full font-medium">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground mb-1">
                    {step.description}
                  </div>

                  {/* Timestamp */}
                  {timestamps[step.status] && (
                    <div className="text-xs text-muted-foreground font-mono">
                      {timestamps[step.status]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Status Summary */}
      <div className="border-t border-border pt-3 mt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current Status</span>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isError
                  ? 'bg-red-500'
                  : currentStatus === 'filled'
                    ? 'bg-green-500'
                    : 'bg-accent animate-pulse'
              }`}
            />
            <span className="font-semibold capitalize">
              {currentStatus.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
