import { TrendingUp, AlertCircle } from "lucide-react"
import EmptyState from "./ui/EmptyState"

interface PortfolioCardProps {
  data: any
  isLoading?: boolean
  error?: string
}

export default function PortfolioCard({ data, isLoading, error }: PortfolioCardProps) {
  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm h-full">
        <EmptyState
          icon={<AlertCircle className="h-12 w-12 text-red-500" />}
          title="Portfolio Data Unavailable"
          description={error}
          size="md"
          background="subtle"
          actions={[
            {
              label: "Retry",
              onClick: () => window.location.reload(),
              variant: "primary",
            },
            {
              label: "Settings",
              onClick: () => console.log("Open settings"),
              variant: "secondary",
            },
          ]}
          tip="💡 Check your connection or verify API settings"
        />
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm h-full">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-12 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="h-20 bg-muted rounded" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  // Empty state - no portfolio data
  if (!data || !data.total_value) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm h-full">
        <EmptyState
          icon={<TrendingUp className="h-12 w-12" />}
          title="Your Portfolio is Empty"
          description="Start by connecting your broker account or creating your first paper trade"
          size="md"
          background="subtle"
          actions={[
            {
              label: "Connect Broker",
              onClick: () => console.log("Open broker connection"),
              variant: "primary",
            },
            {
              label: "Start Trading",
              onClick: () => console.log("Open trade modal"),
              variant: "secondary",
            },
          ]}
          tip="💡 Paper trading is enabled by default - no real money at risk!"
        />
      </div>
    )
  }

  // Normal state - display portfolio data
  const totalValue = data?.total_value ?? 0
  const buyingPower = data?.buying_power ?? 0
  const percentageOfBudget = totalValue > 0 ? ((buyingPower / totalValue) * 100).toFixed(1) : "0"
  const invested = totalValue - buyingPower

  return (
    <div className="w-full h-full p-4 flex flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Portfolio Value
          </p>
          <h2 className="text-xl sm:text-2xl font-bold mt-1 leading-tight">
            ${totalValue.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </h2>
          <p className="text-xs text-green-600 dark:text-green-500 font-semibold mt-0.5">+2.5% today</p>
        </div>
        <div className="rounded-full bg-accent/10 p-1.5 flex-shrink-0">
          <TrendingUp className="h-4 w-4 text-accent" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Buying Power
          </p>
          <p className="text-sm sm:text-base font-bold mt-0.5 leading-tight">
            ${buyingPower.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </p>
          <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all"
              style={{ width: `${percentageOfBudget}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{percentageOfBudget}%</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Invested
          </p>
          <p className="text-sm sm:text-base font-bold mt-0.5 leading-tight">
            ${invested.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </p>
          <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all"
              style={{ width: `${100 - parseFloat(percentageOfBudget)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{(100 - parseFloat(percentageOfBudget)).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  )
}
