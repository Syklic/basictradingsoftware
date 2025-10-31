import { useEffect, useState } from 'react'
import PortfolioCard from './PortfolioCard'
import OrdersPanel from './OrdersPanel'
import SignalsPanel from './SignalsPanel'

export default function Dashboard() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [ordersData, setOrdersData] = useState([])
  const [signalsData, setSignalsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [portfolioRes, ordersRes, signalsRes] = await Promise.all([
          fetch('http://localhost:8000/api/portfolio'),
          fetch('http://localhost:8000/api/orders'),
          fetch('http://localhost:8000/api/signals'),
        ])

        if (portfolioRes.ok) {
          setPortfolioData(await portfolioRes.json())
        }
        if (ordersRes.ok) {
          setOrdersData(await ordersRes.json())
        }
        if (signalsRes.ok) {
          setSignalsData(await signalsRes.json())
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PortfolioCard data={portfolioData} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OrdersPanel orders={ordersData} />
        <SignalsPanel signals={signalsData} />
      </div>
    </div>
  )
}
