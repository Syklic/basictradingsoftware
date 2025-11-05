import { Save, X, RotateCcw } from 'lucide-react'
import { useState, useRef } from 'react'
import { useLayoutStore } from '../store/layoutStore'

export default function LayoutBuilder() {
  const layout = useLayoutStore((state) => state.currentLayout())
  const setEditMode = useLayoutStore((state) => state.setEditMode)
  const updateWidgetPosition = useLayoutStore((state) => state.updateWidgetPosition)
  const updateWidgetSize = useLayoutStore((state) => state.updateWidgetSize)
  const resetToDefault = useLayoutStore((state) => state.resetToDefault)
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  if (!layout) return null

  const enabledWidgets = layout.widgets.filter((w) => w.enabled)
  const CELL_SIZE = 80
  const GRID_GAP = 12
  const DRAG_THRESHOLD = 5
  const PADDING = 16

  // Check if two widgets overlap
  const checkOverlap = (w1: any, w2: any) => {
    return !(
      w1.position.x + w1.size.width <= w2.position.x ||
      w2.position.x + w2.size.width <= w1.position.x ||
      w1.position.y + w1.size.height <= w2.position.y ||
      w2.position.y + w2.size.height <= w1.position.y
    )
  }

  // Find next available position for a widget
  const findNextAvailablePosition = (widget: any, targetX: number, targetY: number) => {
    let x = targetX
    let y = targetY

    // Check for overlaps and try to find a free space
    let attempts = 0
    while (attempts < 20) {
      const testWidget = { ...widget, position: { x, y } }
      const hasOverlap = layout.widgets.some(
        (w) => w.type !== widget.type && checkOverlap(testWidget, w)
      )

      if (!hasOverlap) {
        return { x: Math.min(x, layout.gridSize - widget.size.width), y }
      }

      // Try next position (move right, wrap to next row)
      x++
      if (x + widget.size.width > layout.gridSize) {
        x = 0
        y++
      }
      attempts++
    }

    return { x: Math.min(targetX, layout.gridSize - 1), y: targetY }
  }

  const handleWidgetMouseDown = (e: React.MouseEvent, widgetType: string) => {
    e.preventDefault()
    setSelectedWidget(widgetType)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleGridMouseMove = (e: React.MouseEvent) => {
    if (!dragStart || !selectedWidget || !gridRef.current) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance < DRAG_THRESHOLD) return

    if (!isDragging) {
      setIsDragging(true)
    }

    // Get the grid container that has overflow: auto
    const gridContainer = gridRef.current.parentElement
    if (!gridContainer) return

    // Get bounding rect of the scrollable container
    const containerRect = gridContainer.getBoundingClientRect()
    
    // Calculate mouse position relative to the grid (accounting for scroll)
    const mouseX = e.clientX - containerRect.left + gridContainer.scrollLeft
    const mouseY = e.clientY - containerRect.top + gridContainer.scrollTop
    
    // The grid itself has padding of PADDING pixels
    // Subtract that to get position within the actual grid content
    const gridContentX = mouseX - PADDING
    const gridContentY = mouseY - PADDING
    
    // Clamp to non-negative values
    if (gridContentX < 0 || gridContentY < 0) return
    
    // Calculate which grid cell we're over by dividing by (CELL_SIZE + GRID_GAP)
    const CELL_TOTAL = CELL_SIZE + GRID_GAP
    const gridX = Math.floor(gridContentX / CELL_TOTAL)
    const gridY = Math.floor(gridContentY / CELL_TOTAL)

    const selectedWidgetData = layout.widgets.find((w) => w.type === selectedWidget)
    if (!selectedWidgetData) return

    // Clamp to valid grid range
    const maxX = Math.max(0, layout.gridSize - selectedWidgetData.size.width)
    const clampedX = Math.min(gridX, maxX)
    const clampedY = Math.max(0, gridY)

    updateWidgetPosition(selectedWidget, clampedX, clampedY)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragStart(null)
  }

  const handleSave = () => {
    setEditMode(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="bg-card border border-border rounded-lg shadow-xl w-[95vw] h-[95vh] overflow-hidden flex flex-col">
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
        <div className="flex-1 overflow-y-auto flex flex-col p-6">
          {/* Grid Editor */}
          <div className="flex-1 flex flex-col min-w-0 mb-4">
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Dashboard Grid</p>
              <p className="text-xs text-muted-foreground mb-4">Click and drag widgets to move them. They'll snap into place.</p>
            </div>

            <div className="flex-1 overflow-auto border-2 border-dashed border-border rounded-lg p-4">
              <div
                ref={gridRef}
                onMouseMove={handleGridMouseMove}
                className="bg-muted/30 rounded-lg relative inline-block"
                style={{
                  width: (layout.gridSize * CELL_SIZE) + ((layout.gridSize - 1) * GRID_GAP) + 32,
                  minHeight: 500,
                  backgroundColor: 'repeating-linear-gradient(0deg, hsl(var(--border)) 0px, hsl(var(--border)) 1px, transparent 1px, transparent ' + CELL_SIZE + 'px), repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 1px, transparent 1px, transparent ' + CELL_SIZE + 'px)',
                  backgroundPosition: `0 0`,
                  backgroundSize: `${CELL_SIZE + GRID_GAP}px ${CELL_SIZE + GRID_GAP}px`,
                }}
              >
                {enabledWidgets.map((widget) => {
                  const left = widget.position.x * (CELL_SIZE + GRID_GAP) + PADDING
                  const top = widget.position.y * (CELL_SIZE + GRID_GAP) + PADDING
                  const width = widget.size.width * CELL_SIZE + (widget.size.width - 1) * GRID_GAP
                  const height = widget.size.height * CELL_SIZE + (widget.size.height - 1) * GRID_GAP
                  const isSelected = selectedWidget === widget.type
                  const isDraggingThis = isDragging && isSelected

                  return (
                    <div
                      key={widget.id}
                      onMouseDown={(e) => handleWidgetMouseDown(e, widget.type)}
                      onClick={() => setSelectedWidget(widget.type)}
                      className={`absolute p-3 rounded-lg border-2 transition-all flex items-center justify-center text-center ${
                        isDraggingThis
                          ? 'cursor-grabbing bg-accent/30 border-accent shadow-xl opacity-90'
                          : isSelected
                          ? 'cursor-grab bg-accent/20 border-accent shadow-lg'
                          : 'cursor-grab bg-card border-border hover:border-accent/50'
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
          </div>

          {/* Edit Controls - Below Grid (Compact) */}
          {selectedWidget && (
            <div className="flex-shrink-0 p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs font-medium mb-2">Edit: {selectedWidget}</p>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">X</label>
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
                    className="w-full px-2 py-1 bg-background border border-input rounded text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Y</label>
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
                    className="w-full px-2 py-1 bg-background border border-input rounded text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Width</label>
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
                    className="w-full px-2 py-1 bg-background border border-input rounded text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Height</label>
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
                    className="w-full px-2 py-1 bg-background border border-input rounded text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border gap-2">
          <button
            onClick={resetToDefault}
            className="px-4 py-2 text-red-600 hover:bg-red-500/10 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Layout
          </button>
        </div>
      </div>
    </div>
  )
}
