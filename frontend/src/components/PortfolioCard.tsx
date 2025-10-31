import { TrendingUp } from 'lucide-react'

interface PortfolioCardProps {
  data: any
}

export default function PortfolioCard({ data }: PortfolioCardProps) {
  const totalValue = data?.total_value ?? 0
  const buyingPower = data?.buying_power ?? 0

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Total Portfolio Value
          </p>
          <p className="text-3xl font-bold mt-2">${totalValue.toFixed(2)}</p>
        </div>
        <div className="rounded-full bg-accent/10 p-3">
          <TrendingUp className="h-6 w-6 text-accent" />
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">Buying Power</p>
        <p className="text-xl font-semibold mt-1">${buyingPower.toFixed(2)}</p>
      </div>
    </div>
  )
}
