import { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ThemeCustomizer from './components/ThemeCustomizer'
import SettingsDialog from './components/SettingsDialog'

// Update this to your WSL IP address
const API_BASE_URL = 'http://172.23.188.30:8000'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [chartColor, setChartColor] = useState('#3b82f6')
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    // Load chart color from localStorage
    const savedColor = localStorage.getItem('chart-color')
    if (savedColor) {
      setChartColor(savedColor)
    }

    // Check backend connection on mount
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`)
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

  const handleChartColorChange = (color: string) => {
    setChartColor(color)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        onCollapsedChange={setSidebarCollapsed}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      <Navbar
        isConnected={isConnected}
        sidebarCollapsed={sidebarCollapsed}
        onThemeOpen={() => setIsThemeOpen(true)}
      />
      
      <main
        className={`transition-all duration-300 ease-in-out pt-16 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Dashboard chartColor={chartColor} />
      </main>

      {/* Theme Customizer - Rendered at top level to avoid z-index issues */}
      <ThemeCustomizer
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
        onColorChange={handleChartColorChange}
        currentColor={chartColor}
      />

      {/* Settings Dialog - Rendered at top level to avoid z-index issues */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}

export default App
