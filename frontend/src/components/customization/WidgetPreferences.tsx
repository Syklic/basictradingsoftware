import { useState } from 'react'
import { Pin, Star, Settings, Clock } from 'lucide-react'
import type { WidgetPreference, FavoriteAsset } from '../../types/customization'

interface WidgetPreferencesProps {
  preferences: WidgetPreference[]
  favorites: FavoriteAsset[]
  onUpdatePreference: (preference: WidgetPreference) => void
  onAddFavorite: (asset: FavoriteAsset) => void
  onRemoveFavorite: (symbol: string) => void
}

/**
 * Widget Preferences Manager
 * Pin widgets, manage favorites, customize refresh rates and colors
 */
export default function WidgetPreferences({
  preferences,
  favorites,
  onUpdatePreference,
  onAddFavorite,
  onRemoveFavorite,
}: WidgetPreferencesProps) {
  const [activeAsset, setActiveAsset] = useState<string | null>(null)
  const [newAssetSearch, setNewAssetSearch] = useState('')

  const togglePin = (widgetId: string) => {
    const pref = preferences.find((p) => p.widgetId === widgetId)
    if (pref) {
      onUpdatePreference({ ...pref, isPinned: !pref.isPinned })
    }
  }

  const toggleFavorite = (widgetId: string) => {
    const pref = preferences.find((p) => p.widgetId === widgetId)
    if (pref) {
      onUpdatePreference({ ...pref, isFavorited: !pref.isFavorited })
    }
  }

  const updateRefreshRate = (widgetId: string, rate: number) => {
    const pref = preferences.find((p) => p.widgetId === widgetId)
    if (pref) {
      onUpdatePreference({ ...pref, refreshRate: rate })
    }
  }

  const updateColor = (widgetId: string, color: string) => {
    const pref = preferences.find((p) => p.widgetId === widgetId)
    if (pref) {
      onUpdatePreference({ ...pref, customColor: color })
    }
  }

  return (
    <div className="space-y-6">
      {/* Pinned Widgets Section */}
      <div>
        <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
          <Pin className="h-4 w-4" />
          Pinned Widgets
        </h3>
        <div className="space-y-2">
          {preferences.filter((p) => p.isPinned).length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No pinned widgets. Pin widgets to keep them visible when scrolling.
            </p>
          ) : (
            preferences
              .filter((p) => p.isPinned)
              .map((pref) => (
                <div
                  key={pref.widgetId}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{pref.widgetType}</div>
                    <div className="text-xs text-muted-foreground">Refresh: {pref.refreshRate}s</div>
                  </div>
                  <button
                    onClick={() => togglePin(pref.widgetId)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Pin className="h-4 w-4 fill-current" />
                  </button>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Favorite Assets Section */}
      <div>
        <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
          <Star className="h-4 w-4" />
          Favorite Assets
        </h3>

        {/* Current Favorites */}
        <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3">
          {favorites.map((asset) => (
            <div
              key={asset.symbol}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-2"
            >
              <div className="text-xs font-medium">{asset.symbol}</div>
              <button
                onClick={() => onRemoveFavorite(asset.symbol)}
                className="p-0.5 text-yellow-500 hover:bg-yellow-50 rounded"
              >
                <Star className="h-3 w-3 fill-current" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Favorite */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add asset (e.g., BTC, ETH)"
            value={newAssetSearch}
            onChange={(e) => setNewAssetSearch(e.target.value)}
            className="flex-1 rounded border border-input bg-background px-2 py-1.5 text-xs"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newAssetSearch) {
                onAddFavorite({
                  symbol: newAssetSearch.toUpperCase(),
                  name: newAssetSearch,
                  exchange: 'Auto',
                  addedAt: new Date().toISOString(),
                  order: favorites.length,
                })
                setNewAssetSearch('')
              }
            }}
          />
          <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-700">
            Add
          </button>
        </div>
      </div>

      {/* Widget Customization Section */}
      <div>
        <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Widget Settings
        </h3>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {preferences.map((pref) => (
            <div
              key={pref.widgetId}
              className="rounded-lg border border-border bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{pref.widgetType}</h4>
                <div className="flex gap-1">
                  <button
                    onClick={() => togglePin(pref.widgetId)}
                    className={`p-1 rounded ${
                      pref.isPinned
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(pref.widgetId)}
                    className={`p-1 rounded ${
                      pref.isFavorited
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Star className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Refresh Rate */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium">
                  <Clock className="h-3 w-3" />
                  Refresh Rate
                </label>
                <div className="mt-1 flex gap-1">
                  {[5, 10, 30, 60].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => updateRefreshRate(pref.widgetId, rate)}
                      className={`px-2 py-1 text-xs rounded border ${
                        pref.refreshRate === rate
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {rate}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Override */}
              <div>
                <label className="text-xs font-medium">Color Override</label>
                <div className="mt-1 flex gap-2">
                  <div
                    className="h-8 w-8 rounded border-2 border-border cursor-pointer hover:border-primary"
                    style={{
                      backgroundColor: pref.customColor || '#rgb(0, 0, 0)',
                    }}
                  />
                  <input
                    type="color"
                    value={pref.customColor || '#000000'}
                    onChange={(e) => updateColor(pref.widgetId, e.target.value)}
                    className="flex-1 rounded border border-input cursor-pointer"
                  />
                  {pref.customColor && (
                    <button
                      onClick={() => updateColor(pref.widgetId, '')}
                      className="px-2 py-1 text-xs rounded border border-border hover:bg-muted"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
