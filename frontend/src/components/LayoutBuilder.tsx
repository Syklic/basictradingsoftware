import { Save, X, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useLayoutStore } from '../store/layoutStore'

export default function LayoutBuilder() {
  const layout = useLayoutStore((state) => state.currentLayout())
  const setEditMode = useLayoutStore((state) => state.setEditMode)
  const updateWidgetPosition = useLayoutStore((state) => state.updateWidgetPosition)
  const updateWidgetSize = useLayoutStore((state) => state.updateWidgetSize)
  const resetToDefault = useLayoutStore((state) => state.resetToDefault)
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  if (!layout) return null

  const enabledWidgets = layout.widgets.filter((w) => w.enabled)
  const CELL_SIZE = 80 // pixels per grid cell
  const GRID_GAP = 12 // pixels between cells

  const handleWidgetDragStart = (e: React.MouseEvent, widgetType: string) => {
    setIsDragging(true)
    setSelectedWidget(widgetType)
  }

  const handleGridClick = (x: number, y: number) => {
    if (selectedWidget && !isDragging) {
      updateWidgetPosition(selectedWidget, x, y)
    }
  }

  const handleSave = () => {
    setEditMode(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Edit Layout</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {selectedWidget ? `Selected: ${selectedWidget}` : 'Click widgets to select'}
            </p>
            <button
              onClick={() => setEditMode(false)}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 flex gap-6">
          {/* Left: Grid Editor */}
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Dashboard Grid</p>
              <p className="text-xs text-muted-foreground mb-4">Click a widget to select it. Drag within grid to move.</p>
            </div>

            <div
              className="bg-muted/30 rounded-lg border-2 border-dashed border-border p-4 relative overflow-auto"
              style={{
                width: (layout.gridSize * CELL_SIZE) + ((layout.gridSize - 1) * GRID_GAP) + 32,
                minHeight: 600,
                backgroundColor: 'repeating-linear-gradient(0deg, hsl(var(--border)) 0px, hsl(var(--border)) 1px, transparent 1px, transparent ' + CELL_SIZE + 'px), repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 1px, transparent 1px, transparent ' + CELL_SIZE + 'px)',
                backgroundPosition: `0 0`,
                backgroundSize: `${CELL_SIZE + GRID_GAP}px ${CELL_SIZE + GRID_GAP}px`,
              }}
            >
              {/* Widget Boxes */}
              {enabledWidgets.map((widget) => {
                const left = widget.position.x * (CELL_SIZE + GRID_GAP) + 16
                const top = widget.position.y * (CELL_SIZE + GRID_GAP) + 16
                const width = widget.size.width * CELL_SIZE + (widget.size.width - 1) * GRID_GAP
                const height = widget.size.height * CELL_SIZE + (widget.size.height - 1) * GRID_GAP
                const isSelected = selectedWidget === widget.type

                return (
                  <div
                    key={widget.id}
                    onMouseDown={(e) => handleWidgetDragStart(e, widget.type)}
                    onClick={() => setSelectedWidget(widget.type)}
                    className={`absolute p-3 rounded-lg border-2 cursor-move transition-all flex items-center justify-center text-center ${
                      isSelected
                        ? 'bg-accent/20 border-accent shadow-lg'
                        : 'bg-card border-border hover:border-accent/50'
                    }`}
                    style={{
                      left: `${left}px`,
                      top: `${top}px`,
                      width: `${width}px`,
                      height: `${height}px`,
                      userSelect: 'none',
                    }}
                  >
                    <div className="text-xs font-medium truncate">
                      {widget.type}
                      <div className="text-xs text-muted-foreground">
                        {widget.size.width}x{widget.size.height}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Widget Controls */}
          <div className="w-64 space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Enabled Widgets ({enabledWidgets.length})</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {enabledWidgets.map((widget) => {
                  const isSelected = selectedWidget === widget.type
                  return (
                    <button
                      key={widget.id}
                      onClick={() => setSelectedWidget(widget.type)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                        isSelected
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {widget.type}
                      <div className="text-xs text-muted-foreground font-normal">
                        Pos: ({widget.position.x}, {widget.position.y}) | Size: {widget.size.width}x{widget.size.height}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Widget Controls */}
            {selectedWidget && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm font-medium mb-3">Edit: {selectedWidget}</p>
                
                <div className="space-y-3">
                  {/* Position Controls */}
                  <div>
                    <label className="text-xs font-medium mb-1 block">Position</label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">X</label>
                        <input
                          type="number"
                          min="0"
                          max={layout.gridSize - 1}
                          defaultValue={layout.widgets.find((w) => w.type === selectedWidget)?.position.x}
                          onChange={(e) => {
                            const widget = layout.widgets.find((w) => w.type === selectedWidget)
                            if (widget) {
                              updateWidgetPosition(selectedWidget, parseInt(e.target.value), widget.position.y)
                            }
                          }}
                          className="w-full px-2 py-1 bg-background border border-input rounded text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">Y</label>
                        <input
                          type="number"
                          min="0"
                          defaultValue={layout.widgets.find((w) => w.type === selectedWidget)?.position.y}
                          onChange={(e) => {
                            const widget = layout.widgets.find((w) => w.type === selectedWidget)
                            if (widget) {
                              updateWidgetPosition(selectedWidget, widget.position.x, parseInt(e.target.value))
                            }
                          }}
                          className="w-full px-2 py-1 bg-background border border-input rounded text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Size Controls */}
                  <div>
                    <label className="text-xs font-medium mb-1 block">Size</label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">Width</label>
                        <input
                          type="number"
                          min="1"
                          max={layout.gridSize}
                          defaultValue={layout.widgets.find((w) => w.type === selectedWidget)?.size.width}
                          onChange={(e) => {
                            const widget = layout.widgets.find((w) => w.type === selectedWidget)
                            if (widget) {
                              updateWidgetSize(selectedWidget, parseInt(e.target.value), widget.size.height)
                            }
                          }}
                          className="w-full px-2 py-1 bg-background border border-input rounded text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">Height</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          defaultValue={layout.widgets.find((w) => w.type === selectedWidget)?.size.height}
                          onChange={(e) => {
                            const widget = layout.widgets.find((w) => w.type === selectedWidget)
                            if (widget) {
                              updateWidgetSize(selectedWidget, widget.size.width, parseInt(e.target.value))
                            }
                          }}
                          className="w-full px-2 py-1 bg-background border border-input rounded text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3 p-2 bg-background rounded">
                  💡 Adjust size and position values or drag widgets on the grid.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 p-6 flex gap-2">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg font-medium text-sm transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-accent text-accent-foreground hover:opacity-90 rounded-lg font-medium text-sm transition-opacity flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Layout
          </button>
        </div>
      </div>
    </div>
  )
}
