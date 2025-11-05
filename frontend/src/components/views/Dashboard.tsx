import { useEffect } from "react"
import { LayoutDashboard } from "lucide-react"
import PortfolioCard from "../PortfolioCard"
import PriceChart from "../PriceChart"
import CandlestickChart from "../CandlestickChart"
import OrdersPanel from "../OrdersPanel"
import SignalsPanel from "../SignalsPanel"
import StatsWidget from "../StatsWidget"
import CurrentWidgetsDisplay from "../CurrentWidgetsDisplay"
import { useLayoutStore } from "../../store/layoutStore"

interface DashboardProps {
  chartColor?: string
}

const mockChartData = [
  { time: "12:00 PM", value: 9800 },
  { time: "1:00 PM", value: 9950 },
  { time: "2:00 PM", value: 9850 },
  { time: "3:00 PM", value: 10050 },
  { time: "4:00 PM", value: 10200 },
  { time: "5:00 PM", value: 10100 },
]

const mockCandleData = [
  { time: "12:00 PM", open: 9800, high: 9900, low: 9750, close: 9850 },
  { time: "1:00 PM", open: 9850, high: 10000, low: 9820, close: 9950 },
  { time: "2:00 PM", open: 9950, high: 9980, low: 9800, close: 9850 },
  { time: "3:00 PM", open: 9850, high: 10100, low: 9840, close: 10050 },
  { time: "4:00 PM", open: 10050, high: 10250, low: 10020, close: 10200 },
  { time: "5:00 PM", open: 10200, high: 10220, low: 10050, close: 10100 },
]

const mockPortfolioData = { total_value: 10000.00, buying_power: 5000.00 }

const mockStatsData = {
  totalReturn: 2500,
  totalReturnPercent: 25,
  winRate: 62,
  winningTrades: 31,
  losingTrades: 19,
  averageTrade: 80.65,
  maxDrawdown: 12.5,
  sharpeRatio: 1.8,
  profitFactor: 2.1,
}

const renderWidget = (widget: any, chartColor: string) => {
  switch (widget.type) {
    case "portfolio":
      return <PortfolioCard data={mockPortfolioData} key={widget.id} />
    case "stats":
      return <StatsWidget key={widget.id} data={mockStatsData} />
    case "chart":
      return <PriceChart key={widget.id} title="Portfolio Value" data={mockChartData} type="area" height={280} color={chartColor} />
    case "candlestick":
      return <CandlestickChart key={widget.id} title="Price Action" data={mockCandleData} height={280} color={chartColor} />
    case "orders":
      return <OrdersPanel key={widget.id} orders={[]} />
    case "signals":
      return <SignalsPanel key={widget.id} signals={[]} />
    default:
      return null
  }
}

export default function Dashboard({ chartColor = "#3b82f6" }: DashboardProps) {
  const currentLayout = useLayoutStore((state) => state.currentLayout)
  
  const layout = currentLayout()
  
  if (!layout) {
    return <div className="p-6">Loading...</div>
  }

  const enabledWidgets = layout.widgets.filter((w) => w.enabled)
  const CELL_SIZE = 80
  const GRID_GAP = 12

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-accent" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="relative" style={{display: "grid", gridTemplateColumns: `repeat(12, minmax(0, 1fr))`, gap: `${GRID_GAP}px`, gridAutoRows: "auto"}}>
        {enabledWidgets.map((widget) => (
          <div 
            key={widget.id}
            className="rounded-lg border border-border bg-card shadow-sm overflow-hidden"
            style={{
              gridColumn: `span ${Math.min(widget.size.width, 12)}`,
              gridRow: `span ${widget.size.height}`,
              minHeight: `${widget.size.height * CELL_SIZE + (widget.size.height - 1) * GRID_GAP}px`,
            }}
          >
            {renderWidget(widget, chartColor)}
          </div>
        ))}
      </div>

      <CurrentWidgetsDisplay />
    </div>
  )
}
