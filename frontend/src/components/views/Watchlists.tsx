import { Eye, Plus, Trash2 } from 'lucide-react'

export default function Watchlists() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold">Watchlists</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          New Watchlist
        </button>
      </div>

      <div className="space-y-4">
        {/* Sample Watchlists */}
        {['Tech Stocks', 'Crypto Assets', 'Favorites'].map((list) => (
          <div key={list} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{list}</h2>
              <button className="p-1 hover:bg-muted rounded transition-colors text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {['Asset 1', 'Asset 2', 'Asset 3'].map((asset, i) => (
                <div key={i} className="bg-muted p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-medium">{asset}</div>
                    <div className="text-xs text-muted-foreground">Placeholder price</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">--</div>
                    <div className="text-xs text-muted-foreground">24h: --</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-3 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium">
              <Plus className="h-4 w-4 inline mr-2" />
              Add Asset
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
