import { useState } from 'react'
import { HelpCircle, Video, Book, Keyboard, X, ExternalLink } from 'lucide-react'
import type { HelpArticle, KeyboardShortcut, SmartSuggestion } from '../../types/onboarding'

interface ContextualHelpProps {
  feature: string
  explanation: string
  videoUrl?: string
  detailedGuide?: string
  shortcuts?: KeyboardShortcut[]
  suggestions?: SmartSuggestion[]
  documentationLink?: string
}

/**
 * Contextual Help Component
 * Help icons, video tutorials, keyboard shortcuts, documentation links
 */
export default function ContextualHelp({
  feature,
  explanation,
  videoUrl,
  detailedGuide,
  shortcuts,
  suggestions,
  documentationLink,
}: ContextualHelpProps) {
  const [showHelp, setShowHelp] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'video' | 'shortcuts' | 'guide'>(
    'overview'
  )
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set())

  const visibleSuggestions = suggestions?.filter((s) => !dismissedSuggestions.has(s.id)) || []

  const dismissSuggestion = (id: string) => {
    const updated = new Set(dismissedSuggestions)
    updated.add(id)
    setDismissedSuggestions(updated)
  }

  return (
    <div className="relative">
      {/* Help Icon */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-muted-foreground hover:bg-muted transition-colors"
        title={`Help: ${feature}`}
      >
        <HelpCircle className="h-4 w-4" />
      </button>

      {/* Help Popup */}
      {showHelp && (
        <div className="absolute right-0 top-8 w-96 max-h-96 bg-white rounded-lg shadow-xl border border-border z-40 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              {feature}
            </h3>
            <button
              onClick={() => setShowHelp(false)}
              className="p-1 hover:bg-muted rounded text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs */}
          {(videoUrl || detailedGuide || shortcuts) && (
            <div className="flex gap-1 px-4 pt-3 border-b border-border">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Overview
              </button>
              {videoUrl && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 transition-colors ${
                    activeTab === 'video'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Video
                </button>
              )}
              {shortcuts && shortcuts.length > 0 && (
                <button
                  onClick={() => setActiveTab('shortcuts')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 transition-colors ${
                    activeTab === 'shortcuts'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Shortcuts
                </button>
              )}
              {detailedGuide && (
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 transition-colors ${
                    activeTab === 'guide'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Guide
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground">{explanation}</p>

                {documentationLink && (
                  <a
                    href={documentationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium"
                  >
                    <Book className="h-3 w-3" />
                    Read Documentation
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}

            {/* Video Tab */}
            {activeTab === 'video' && videoUrl && (
              <div className="p-4 space-y-3">
                <div className="rounded-lg bg-muted aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-2">Video Tutorial</p>
                  </div>
                </div>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium"
                >
                  <Video className="h-3 w-3" />
                  Watch on YouTube
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Shortcuts Tab */}
            {activeTab === 'shortcuts' && shortcuts && shortcuts.length > 0 && (
              <div className="p-4 space-y-2">
                {shortcuts.map((shortcut, idx) => (
                  <div key={idx} className="rounded-lg border border-border p-2 bg-muted/30">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-foreground">{shortcut.action}</div>
                        <div className="text-xs text-muted-foreground">{shortcut.description}</div>
                      </div>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key) => (
                          <kbd
                            key={key}
                            className="px-2 py-0.5 rounded border border-border bg-background text-xs font-mono"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Guide Tab */}
            {activeTab === 'guide' && detailedGuide && (
              <div className="p-4">
                <div className="text-xs text-muted-foreground prose prose-sm max-w-none">
                  {detailedGuide}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inline Suggestions */}
      {visibleSuggestions.length > 0 && (
        <div className="space-y-2 mt-2">
          {visibleSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`rounded-lg border p-3 text-xs ${
                suggestion.type === 'warning'
                  ? 'bg-red-50 border-red-200'
                  : suggestion.type === 'achievement'
                    ? 'bg-yellow-50 border-yellow-200'
                    : suggestion.type === 'opportunity'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{suggestion.title}</div>
                  <p className="text-muted-foreground mt-1">{suggestion.message}</p>

                  {suggestion.action && (
                    <button
                      onClick={suggestion.action.callback}
                      className="mt-2 px-2 py-1 rounded text-xs font-medium bg-white border border-current hover:bg-muted"
                    >
                      {suggestion.action.label}
                    </button>
                  )}
                </div>

                {suggestion.dismissible && (
                  <button
                    onClick={() => dismissSuggestion(suggestion.id)}
                    className="text-muted-foreground hover:text-foreground p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
