import { useState } from 'react'
import { Copy, Download, Eye, Check } from 'lucide-react'
import type { Theme, ThemeColors, FontSizeOption, DensityOption } from '../../types/customization'

interface ThemeCustomizerProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
  onPrebuiltThemeSelect: (themeId: string) => void
  onExportTheme: (theme: Theme) => void
}

/**
 * Advanced Theme Customizer
 * Customize colors, typography, and density settings
 */
export default function ThemeCustomizer({
  currentTheme,
  onThemeChange,
  onPrebuiltThemeSelect,
  onExportTheme,
}: ThemeCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'density'>('colors')
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const PREBUILT_THEMES = [
    {
      id: 'dark-pro',
      name: 'Dark Pro',
      description: 'Professional dark theme for focused trading',
      preview: { bg: '#0f0f0f', fg: '#ffffff' },
    },
    {
      id: 'light-minimal',
      name: 'Light Minimal',
      description: 'Clean light theme with minimal distractions',
      preview: { bg: '#ffffff', fg: '#000000' },
    },
    {
      id: 'solarized',
      name: 'Solarized',
      description: 'Easy on the eyes color scheme',
      preview: { bg: '#fdf6e3', fg: '#657b83' },
    },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'Maximum accessibility with bold colors',
      preview: { bg: '#000000', fg: '#ffff00' },
    },
  ]

  const ColorPicker = ({
    label,
    color,
    onChange,
  }: {
    label: string
    color: string
    onChange: (color: string) => void
  }) => (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 rounded-lg border-2 border-border cursor-pointer hover:border-primary"
        style={{ backgroundColor: color }}
        onClick={() => setShowColorPicker(label)}
      />
      <div className="flex-1">
        <label className="text-xs font-medium">{label}</label>
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded border border-input px-2 py-1 text-xs"
        />
      </div>
    </div>
  )

  const FontSizeSelector = ({
    value,
    onChange,
  }: {
    value: FontSizeOption
    onChange: (size: FontSizeOption) => void
  }) => (
    <div className="space-y-3">
      <label className="text-sm font-medium">Font Size</label>
      <div className="flex gap-2">
        {(['small', 'medium', 'large'] as FontSizeOption[]).map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`flex-1 py-2 rounded-lg border transition-colors ${
              value === size
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:border-primary'
            }`}
          >
            <span
              className={`text-${size === 'small' ? 'xs' : size === 'medium' ? 'sm' : 'base'}`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )

  const DensitySelector = ({
    value,
    onChange,
  }: {
    value: DensityOption
    onChange: (density: DensityOption) => void
  }) => (
    <div className="space-y-3">
      <label className="text-sm font-medium">Density</label>
      <div className="grid grid-cols-3 gap-2">
        {(['compact', 'comfortable', 'spacious'] as DensityOption[]).map((density) => (
          <button
            key={density}
            onClick={() => onChange(density)}
            className={`py-3 rounded-lg border text-xs font-medium transition-colors ${
              value === density
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:border-primary'
            }`}
          >
            {density.charAt(0).toUpperCase() + density.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Prebuilt Themes */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Pre-built Themes</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {PREBUILT_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onPrebuiltThemeSelect(theme.id)}
              className="rounded-lg border-2 border-border bg-card p-3 text-left hover:border-primary transition-colors"
            >
              <div className="mb-2 flex h-12 gap-1 rounded overflow-hidden">
                <div
                  className="flex-1"
                  style={{ backgroundColor: theme.preview.bg }}
                />
                <div
                  className="flex-1"
                  style={{ backgroundColor: theme.preview.fg }}
                />
              </div>
              <h4 className="text-xs font-semibold">{theme.name}</h4>
              <p className="text-xs text-muted-foreground">{theme.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Customization Tabs */}
      <div>
        <div className="mb-4 flex gap-2 border-b border-border">
          {(['colors', 'typography', 'density'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div>
              <h4 className="mb-3 text-xs font-semibold">UI Colors</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <ColorPicker
                  label="Background"
                  color={currentTheme.colors.background}
                  onChange={(color) => {
                    const updated = {
                      ...currentTheme,
                      colors: { ...currentTheme.colors, background: color },
                    }
                    onThemeChange(updated)
                  }}
                />
                <ColorPicker
                  label="Foreground"
                  color={currentTheme.colors.foreground}
                  onChange={(color) => {
                    const updated = {
                      ...currentTheme,
                      colors: { ...currentTheme.colors, foreground: color },
                    }
                    onThemeChange(updated)
                  }}
                />
                <ColorPicker
                  label="Primary"
                  color={currentTheme.colors.primary}
                  onChange={(color) => {
                    const updated = {
                      ...currentTheme,
                      colors: { ...currentTheme.colors, primary: color },
                    }
                    onThemeChange(updated)
                  }}
                />
                <ColorPicker
                  label="Accent"
                  color={currentTheme.colors.accent}
                  onChange={(color) => {
                    const updated = {
                      ...currentTheme,
                      colors: { ...currentTheme.colors, accent: color },
                    }
                    onThemeChange(updated)
                  }}
                />
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold">Chart Colors</h4>
              <div className="space-y-3">
                <ColorPicker
                  label="Bullish"
                  color={currentTheme.colors.chart.bullish}
                  onChange={(color) => {
                    const updated = {
                      ...currentTheme,
                      colors: {
                        ...currentTheme.colors,
                        chart: { ...currentTheme.colors.chart, bullish: color },
                      },
                    }
                    onThemeChange(updated)
                  }}
                />
                <ColorPicker
                  label="Bearish"
                  color={currentTheme.colors.chart.bearish}
                  onChange={(color) => {
                    const updated = {
                      ...currentTheme,
                      colors: {
                        ...currentTheme.colors,
                        chart: { ...currentTheme.colors.chart, bearish: color },
                      },
                    }
                    onThemeChange(updated)
                  }}
                />
                <ColorPicker
                  label="Positive"
                  color={currentTheme.colors.chart.positive}
                  onChange={(color) => {
                    const updated = {
                      ...currentTheme,
                      colors: {
                        ...currentTheme.colors,
                        chart: { ...currentTheme.colors.chart, positive: color },
                      },
                    }
                    onThemeChange(updated)
                  }}
                />
                <ColorPicker
                  label="Negative"
                  color={currentTheme.colors.chart.negative}
                  onChange={(color) => {
                    const updated = {
                      ...currentTheme,
                      colors: {
                        ...currentTheme.colors,
                        chart: { ...currentTheme.colors.chart, negative: color },
                      },
                    }
                    onThemeChange(updated)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            <FontSizeSelector
              value={currentTheme.typography.fontSize}
              onChange={(size) => {
                const updated = {
                  ...currentTheme,
                  typography: { ...currentTheme.typography, fontSize: size },
                }
                onThemeChange(updated)
              }}
            />

            <div>
              <label className="text-sm font-medium">Font Family</label>
              <div className="mt-3 space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Sans Serif</span>
                  <input
                    type="text"
                    value={currentTheme.typography.fontFamily.sans}
                    onChange={(e) => {
                      const updated = {
                        ...currentTheme,
                        typography: {
                          ...currentTheme.typography,
                          fontFamily: {
                            ...currentTheme.typography.fontFamily,
                            sans: e.target.value,
                          },
                        },
                      }
                      onThemeChange(updated)
                    }}
                    className="mt-1 w-full rounded border border-input px-2 py-1 text-xs"
                    placeholder="e.g., Inter, -apple-system"
                  />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Monospace</span>
                  <input
                    type="text"
                    value={currentTheme.typography.fontFamily.mono}
                    onChange={(e) => {
                      const updated = {
                        ...currentTheme,
                        typography: {
                          ...currentTheme.typography,
                          fontFamily: {
                            ...currentTheme.typography.fontFamily,
                            mono: e.target.value,
                          },
                        },
                      }
                      onThemeChange(updated)
                    }}
                    className="mt-1 w-full rounded border border-input px-2 py-1 text-xs"
                    placeholder="e.g., Fira Code, monospace"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Density Tab */}
        {activeTab === 'density' && (
          <div className="space-y-4">
            <DensitySelector
              value={currentTheme.density}
              onChange={(density) => {
                const updated = {
                  ...currentTheme,
                  density,
                }
                onThemeChange(updated)
              }}
            />

            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                {currentTheme.density === 'compact'
                  ? 'Compact density: Maximize information density with tighter spacing.'
                  : currentTheme.density === 'comfortable'
                    ? 'Comfortable density: Balanced spacing for most users.'
                    : 'Spacious density: Generous spacing for better readability.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted"
        >
          <Eye className="h-4 w-4" />
          {previewMode ? 'Exit Preview' : 'Preview'}
        </button>

        <button
          onClick={() => onExportTheme(currentTheme)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  )
}
