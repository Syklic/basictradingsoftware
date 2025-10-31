import { useState, useEffect } from 'react'
import { Palette, X } from 'lucide-react'

interface ThemeCustomizerProps {
  isOpen: boolean
  onClose: () => void
  onColorChange: (color: string) => void
  currentColor: string
}

const colorPalette = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#10b981' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Indigo', value: '#6366f1' },
]

export default function ThemeCustomizer({
  isOpen,
  onClose,
  onColorChange,
  currentColor,
}: ThemeCustomizerProps) {
  const [color, setColor] = useState(currentColor)

  useEffect(() => {
    setColor(currentColor)
  }, [currentColor])

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor)
    onColorChange(selectedColor)
    localStorage.setItem('chart-color', selectedColor)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Customize Theme
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Chart Colors</p>
            <div className="grid grid-cols-4 gap-3">
              {colorPalette.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleColorSelect(option.value)}
                  className={`h-10 rounded-lg transition-all border-2 hover:scale-110 ${
                    color === option.value
                      ? 'border-foreground scale-110'
                      : 'border-border'
                  }`}
                  style={{ backgroundColor: option.value }}
                  title={option.name}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Custom Color</p>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  handleColorSelect(e.target.value)
                }}
                className="h-10 rounded-lg cursor-pointer flex-1"
              />
              <span className="text-sm font-mono bg-muted px-3 py-2 rounded-lg">
                {color.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
