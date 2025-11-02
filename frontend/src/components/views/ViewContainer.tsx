import { useNavigationStore } from '../../store/navigationStore'
import Dashboard from './Dashboard'
import Portfolio from './Portfolio'
import TradeExecution from './TradeExecution'
import SignalsStrategy from './SignalsStrategy'
import Analytics from './Analytics'
import Watchlists from './Watchlists'
import Settings from './Settings'

export default function ViewContainer() {
  const currentView = useNavigationStore((state) => state.currentView)
  const selectedAsset = useNavigationStore((state) => state.selectedAsset)

  return (
    <div className="flex-1 overflow-auto">
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'portfolio' && <Portfolio />}
      {currentView === 'trade-execution' && <TradeExecution />}
      {currentView === 'signals-strategy' && <SignalsStrategy />}
      {currentView === 'analytics' && <Analytics />}
      {currentView === 'watchlists' && <Watchlists />}
      {currentView === 'settings' && <Settings />}
    </div>
  )
}
