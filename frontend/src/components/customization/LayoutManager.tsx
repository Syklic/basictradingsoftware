import { useState } from 'react'
import {
  Download,
  Upload,
  Share2,
  Copy,
  Trash2,
  Eye,
  Plus,
  Lock,
  Unlock,
  Grid3x3,
} from 'lucide-react'
import type { Layout } from '../../types/customization'

interface LayoutManagerProps {
  layouts: Layout[]
  activeLayoutId: string
  onSelectLayout: (layoutId: string) => void
  onDeleteLayout: (layoutId: string) => void
  onExportLayout: (layout: Layout) => void
  onImportLayout: (file: File) => void
  onToggleShare: (layoutId: string) => void
  onCreatePreview?: (layoutId: string) => void
}

/**
 * Advanced Layout Manager
 * Save, share, and manage multiple custom workspace layouts
 */
export default function LayoutManager({
  layouts,
  activeLayoutId,
  onSelectLayout,
  onDeleteLayout,
  onExportLayout,
  onImportLayout,
  onToggleShare,
  onCreatePreview,
}: LayoutManagerProps) {
  const [showShareModal, setShowShareModal] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [filterTag, setFilterTag] = useState<string | null>(null)

  const allTags = Array.from(
    new Set(layouts.flatMap((l) => l.tags))
  ).sort()

  const filteredLayouts = filterTag
    ? layouts.filter((l) => l.tags.includes(filterTag))
    : layouts

  const handleCopyShareCode = (shareCode: string) => {
    navigator.clipboard.writeText(shareCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleExportLayout = (layout: Layout) => {
    onExportLayout(layout)
  }

  const LayoutCard = ({ layout }: { layout: Layout }) => {
    const isActive = layout.id === activeLayoutId
    const isCommunity = layout.shareCode && layout.isShared

    return (
      <div
        className={`rounded-lg border-2 transition-all cursor-pointer ${
          isActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-border bg-card hover:border-blue-300'
        }`}
        onClick={() => onSelectLayout(layout.id)}
      >
        {/* Thumbnail */}
        <div className="relative h-32 w-full overflow-hidden rounded-t-md bg-muted">
          {layout.thumbnail ? (
            <img
              src={layout.thumbnail}
              alt={layout.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Grid3x3 className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute right-2 top-2 flex gap-1">
            {layout.isDefault && (
              <div className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                Default
              </div>
            )}
            {isCommunity && (
              <div className="rounded-full bg-purple-500 px-2 py-1 text-xs font-semibold text-white">
                Community
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <div>
            <h3 className="font-semibold line-clamp-1">{layout.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {layout.description}
            </p>
          </div>

          {/* Tags */}
          {layout.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {layout.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
              {layout.tags.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{layout.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{layout.widgets.length} widgets</span>
            <span>{layout.widgets.filter((w) => w.isPinned).length} pinned</span>
          </div>

          {/* Actions */}
          <div className="flex gap-1 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleExportLayout(layout)
              }}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              <Download className="h-3 w-3" />
              Export
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowShareModal(layout.id)
              }}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              <Share2 className="h-3 w-3" />
              Share
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteLayout(layout.id)
              }}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Workspace Layouts</h2>
        <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 cursor-pointer">
          <Upload className="h-4 w-4" />
          Import
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onImportLayout(file)
            }}
            className="hidden"
          />
        </label>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterTag(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              filterTag === null
                ? 'bg-blue-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All ({layouts.length})
          </button>
          {allTags.map((tag) => {
            const count = layouts.filter((l) => l.tags.includes(tag)).length
            return (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filterTag === tag
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tag} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Layouts Grid */}
      {filteredLayouts.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-12 text-center">
          <Grid3x3 className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {filterTag
              ? `No layouts with tag "${filterTag}"`
              : 'No layouts yet. Create one or import from a file.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLayouts.map((layout) => (
            <LayoutCard key={layout.id} layout={layout} />
          ))}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-full max-w-md rounded-lg bg-background p-6">
            <h3 className="mb-4 text-lg font-semibold">Share Layout</h3>

            {layouts.find((l) => l.id === showShareModal)?.isShared ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This layout is currently shared. Share the code below:
                </p>

                <div className="rounded-lg border border-border bg-muted p-4">
                  <code className="text-sm font-mono">
                    {layouts.find((l) => l.id === showShareModal)?.shareCode}
                  </code>
                </div>

                <button
                  onClick={() => {
                    const shareCode = layouts.find((l) => l.id === showShareModal)?.shareCode
                    if (shareCode) handleCopyShareCode(shareCode)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Copy className="h-4 w-4" />
                  {copiedCode ? 'Copied!' : 'Copy Share Code'}
                </button>

                <button
                  onClick={() => {
                    onToggleShare(showShareModal)
                    setShowShareModal(null)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted"
                >
                  <Unlock className="h-4 w-4" />
                  Stop Sharing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enable sharing to generate a share code that others can use to import this layout.
                </p>

                <button
                  onClick={() => {
                    onToggleShare(showShareModal)
                    setShowShareModal(null)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Lock className="h-4 w-4" />
                  Enable Sharing
                </button>
              </div>
            )}

            <button
              onClick={() => setShowShareModal(null)}
              className="mt-4 w-full py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Community Templates Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-3 font-semibold">Community Templates</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Browse and import community-created layouts. Mark your favorites to access them quickly.
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            { name: 'Day Trader Premium', tags: ['trading', 'charts'] },
            { name: 'Long-term Investor', tags: ['analysis', 'metrics'] },
            { name: 'ML Researcher', tags: ['signals', 'backtest'] },
            { name: 'Risk Manager', tags: ['risk', 'alerts'] },
          ].map((template) => (
            <button
              key={template.name}
              className="rounded-lg border border-border bg-muted/30 p-3 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="font-medium text-sm">{template.name}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-muted px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="mt-2 text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">
                Import
              </button>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
