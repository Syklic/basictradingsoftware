import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface CandleDataPoint {
  time: string
  open: number
  high: number
  low: number
  close: number
}

interface CandlestickChartProps {
  title: string
  data: CandleDataPoint[]
  height?: number
  color?: string
}

const CustomCandleTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-card border border-border rounded p-2 shadow-md">
        <p className="text-xs font-semibold text-foreground">{data.time}</p>
        <p className="text-xs text-muted-foreground">O: ${data.open.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">H: ${data.high.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">L: ${data.low.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">C: ${data.close.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

const CustomCandlestick = (props: any) => {
  const { x, y, width, height, payload } = props

  if (!payload) return null

  const yScale = props.yAxis.scale
  const y1 = yScale(payload.high)
  const y2 = yScale(payload.low)
  const y3 = yScale(payload.open)
  const y4 = yScale(payload.close)

  const isUp = payload.close >= payload.open
  const color = isUp ? "#10b981" : "#ef4444"
  const wickX = x + width / 2
  const bodyWidth = Math.max(width * 0.6, 2)
  const bodyX = x + (width - bodyWidth) / 2

  return (
    <g>
      {/* Wick */}
      <line
        x1={wickX}
        y1={y1}
        x2={wickX}
        y2={y2}
        stroke={color}
        strokeWidth={1}
        opacity={0.8}
      />
      {/* Body */}
      <rect
        x={bodyX}
        y={Math.min(y3, y4)}
        width={bodyWidth}
        height={Math.abs(y3 - y4) || 1}
        fill={color}
        stroke={color}
        strokeWidth={1}
        opacity={0.9}
      />
    </g>
  )
}

export default function CandlestickChart({
  title,
  data,
  height = 300,
  color = "#3b82f6",
}: CandlestickChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="rounded-lg border border-border bg-card p-6 flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
            <Tooltip content={<CustomCandleTooltip />} />
            <Bar
              dataKey="close"
              shape={<CustomCandlestick yAxis={{}} />}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
