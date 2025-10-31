import { TrendingUp } from 'lucide-react'

interface PortfolioCardProps {
  data: any
}

export default function PortfolioCard({ data }: PortfolioCardProps) {
  const totalValue = data?.total_value ?? 0
  const buyingPower = data?.buying_power ?? 0
  const percentageOfBudget = ((buyingPower / totalValue) * 100).toFixed(1)

  return (
    <div className="rounded-lg border border-border bg-card p-8 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Portfolio Value
          </p>
          <h2 className="text-4xl font-bold mt-2">${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
          <p className="text-xs text-green-600 font-semibold mt-1">+2.5% today</p>
        </div>
        <div className="rounded-full bg-accent/10 p-4">
          <TrendingUp className="h-8 w-8 text-accent" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Buying Power
          </p>
          <p className="text-2xl font-bold mt-2">
            ${buyingPower.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{percentageOfBudget}% available</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Invested
          </p>
          <p className="text-2xl font-bold mt-2">
            ${(totalValue - buyingPower).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{(100 - parseFloat(percentageOfBudget)).toFixed(1)}% deployed</p>
        </div>
      </div>
    </div>
  )
}
