import { useEffect, useState } from 'react'
import PortfolioCard from './PortfolioCard'
import OrdersPanel from './OrdersPanel'
import SignalsPanel from './SignalsPanel'
import PriceChart from './PriceChart'
import LoadingState from './ui/LoadingState'

// Update this to your WSL IP address
const API_BASE_URL = 'http://172.23.188.30:8000'

// Mock data
const mockChartData = [
  { time: '12:00 PM', value: 9800 },
  { time: '1:00 PM', value: 9950 },
  { time: '2:00 PM', value: 9850 },
  { time: '3:00 PM', value: 10050 },
  { time: '4:00 PM', value: 10200 },
  { time: '5:00 PM', value: 10100 },
]

const mockStatistics = [
  { label: 'Daily Change', value: '+$300.00', change: '+3.06%', positive: true },
  { label: 'Win Rate', value: '62.5%', change: '+5.2%', positive: true },
  { label: 'Total Trades', value: '48', change: '+12', positive: true },
  { label: 'Active Signals', value: '5', change: '-1', positive: false },
]

interface DashboardProps {
  chartColor?: string
}

export default function Dashboard({ chartColor = '#3b82f6' }: DashboardProps) {
  const [portfolioData, setPortfolioData] = useState(null)
  const [ordersData, setOrdersData] = useState([])
  const [signalsData, setSignalsData] = useState([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [portfolioRes, ordersRes, signalsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/portfolio`),
          fetch(`${API_BASE_URL}/api/orders`),
          fetch(`${API_BASE_URL}/api/signals`),
        ])

        // Check if any request failed
        if (!portfolioRes.ok || !ordersRes.ok || !signalsRes.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const portfolioJson = await portfolioRes.json()
        const ordersJson = await ordersRes.json()
        const signalsJson = await signalsRes.json()

        setPortfolioData(portfolioJson)
        setOrdersData(ordersJson.orders || [])
        setSignalsData(signalsJson.signals || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unable to connect to server'
        setError(errorMessage)
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        // Only set initial loading to false on first load
        if (isInitialLoading) {
          setIsInitialLoading(false)
        }
        setIsLoading(false)
      }
    }

    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 5000)
    return () => clearInterval(interval)
  }, [isInitialLoading])

  // Initial loading state
  if (isInitialLoading) {
    return (
      <div className="p-6">
        <LoadingState title="Loading Dashboard" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Portfolio Value Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PortfolioCard 
            data={portfolioData}
            isLoading={isLoading}
            error={error ? 'Unable to load portfolio data' : undefined}
          />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 gap-3">
          {mockStatistics.map((stat, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow">
              <p className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className={`text-xs font-semibold ${stat.positive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceChart
          title="Portfolio Value"
          data={mockChartData}
          type="area"
          height={280}
          color={chartColor}
        />
        <PriceChart
          title="Daily Returns"
          data={mockChartData.map((d) => ({
            ...d,
            returns: Math.random() * 200 - 100,
          }))}
          type="bar"
          dataKey="returns"
          height={280}
          color={chartColor}
        />
      </div>

      {/* Orders & Signals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersPanel orders={ordersData} />
        <SignalsPanel signals={signalsData} />
      </div>
    </div>
  )
}
