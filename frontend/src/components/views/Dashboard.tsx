import { LayoutDashboard } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-accent" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground mb-4">
          Dashboard view - Overview of everything
        </p>

        {/* Dashboard content will go here - connect existing dashboard widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">Portfolio Overview</div>
            <div className="text-2xl font-bold">--</div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">24h P&L</div>
            <div className="text-2xl font-bold text-green-500">--</div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">Active Signals</div>
            <div className="text-2xl font-bold">--</div>
          </div>
        </div>
      </div>
    </div>
  )
}
