import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useLayoutStore } from '../store/layoutStore'

export default function LayoutSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNewLayout, setShowNewLayout] = useState(false)
  const [newLayoutName, setNewLayoutName] = useState('')
  
  const layouts = useLayoutStore((state) => state.layouts)
  const currentLayoutId = useLayoutStore((state) => state.currentLayoutId)
  const setCurrentLayout = useLayoutStore((state) => state.setCurrentLayout)
  const createLayout = useLayoutStore((state) => state.createLayout)
  const deleteLayout = useLayoutStore((state) => state.deleteLayout)

  const currentLayout = layouts.find((l) => l.id === currentLayoutId)

  const handleCreateLayout = () => {
    if (newLayoutName.trim()) {
      createLayout(newLayoutName.trim())
      setNewLayoutName('')
      setShowNewLayout(false)
    }
  }

  return (
    <div className="relative inline-block">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium"
      >
        <span className="truncate max-w-[150px]">{currentLayout?.name || 'Layout'}</span>
        <ChevronDown className="h-4 w-4 flex-shrink-0" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-40">
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {/* Layout List */}
            {layouts.map((layout) => (
              <div
                key={layout.id}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  layout.id === currentLayoutId
                    ? 'bg-accent/20 text-accent-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <button
                  onClick={() => {
                    setCurrentLayout(layout.id)
                    setIsOpen(false)
                  }}
                  className="flex-1 text-left text-sm font-medium"
                >
                  {layout.name}
                  {layout.isDefault && (
                    <span className="text-xs text-muted-foreground ml-1">(default)</span>
                  )}
                </button>
                {!layout.isDefault && (
                  <button
                    onClick={() => deleteLayout(layout.id)}
                    className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                    title="Delete layout"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}

            <div className="border-t border-border my-2" />

            {/* Create New Layout */}
            {!showNewLayout && (
              <button
                onClick={() => setShowNewLayout(true)}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                Create New Layout
              </button>
            )}

            {/* New Layout Input */}
            {showNewLayout && (
              <div className="p-2 space-y-2 border-t border-border">
                <input
                  type="text"
                  placeholder="Layout name..."
                  value={newLayoutName}
                  onChange={(e) => setNewLayoutName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateLayout()
                    }
                  }}
                  className="w-full px-2 py-1 bg-muted border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateLayout}
                    className="flex-1 px-2 py-1 bg-accent text-accent-foreground rounded text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowNewLayout(false)
                      setNewLayoutName('')
                    }}
                    className="flex-1 px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
