import { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'

function App() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check backend connection on mount
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/health')
        if (response.ok) {
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Backend connection failed:', error)
        setIsConnected(false)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar isConnected={isConnected} />
      <main className="flex-1">
        <Dashboard />
      </main>
    </div>
  )
}

export default App
