import { useState } from 'react'
import { Download, Share2, FileText, Share, Mail, X } from 'lucide-react'
import type { ExportFormat, ReportType } from '../../types/export'
import {
  downloadTradesCSV,
  downloadPerformanceCSV,
  downloadPortfolioCSV,
  generateShareLink,
  createShareablePerformanceMessage,
} from '../../utils/exportData'

interface ExportOptionsProps {
  onClose: () => void
  reportType: ReportType
  data: unknown
}

/**
 * Export Options Component
 * CSV, PDF, JSON exports and social media sharing
 */
export default function ExportOptions({ onClose, reportType, data }: ExportOptionsProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv')
  const [blurBalances, setBlurBalances] = useState(true)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<'twitter' | 'linkedin' | 'facebook'>>([])

  const formats: Array<{ id: ExportFormat; label: string; description: string }> = [
    { id: 'csv', label: 'CSV', description: 'Spreadsheet format' },
    { id: 'excel', label: 'Excel', description: 'Microsoft Excel format' },
    { id: 'pdf', label: 'PDF', description: 'Portable Document' },
    { id: 'json', label: 'JSON', description: 'Raw data format' },
  ]

  const platforms: Array<{ id: 'twitter' | 'linkedin' | 'facebook'; label: string; color: string }> = [
    { id: 'twitter', label: 'Twitter', color: 'bg-blue-400' },
    { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-600' },
    { id: 'facebook', label: 'Facebook', color: 'bg-blue-700' },
  ]

  const handleExport = () => {
    try {
      switch (reportType) {
        case 'trades':
          if (selectedFormat === 'csv') {
            downloadTradesCSV(data as any)
          }
          break
        case 'performance':
          if (selectedFormat === 'csv') {
            downloadPerformanceCSV(data as any)
          }
          break
        case 'portfolio':
          if (selectedFormat === 'csv') {
            downloadPortfolioCSV(data as any)
          }
          break
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    try {
      const message = createShareablePerformanceMessage(data as any, blurBalances)
      const shareUrl = generateShareLink(platform, message)
      window.open(shareUrl, '_blank', 'width=600,height=400')
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Export & Share</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Export Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">Export Format</label>
          <div className="grid grid-cols-2 gap-3">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedFormat === format.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium text-sm text-foreground">{format.label}</div>
                <div className="text-xs text-muted-foreground">{format.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-all mb-6"
        >
          <Download className="h-4 w-4" />
          Download {selectedFormat.toUpperCase()}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">Social Share</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Balance Blur Option */}
        <label className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={blurBalances}
            onChange={(e) => setBlurBalances(e.target.checked)}
            className="w-4 h-4 rounded accent-primary cursor-pointer"
            aria-label="Blur balances"
          />
          <span className="text-sm text-foreground">Blur balances in shares</span>
        </label>

        {/* Social Platforms */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">Share To</label>
          <div className="grid grid-cols-3 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform.id)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                } ${platform.color}`}
                aria-label={`Share on ${platform.label}`}
              >
                <Share className="h-4 w-4" />
                <span className="text-xs font-medium">{platform.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Email Report Option */}
        <button className="w-full flex items-center justify-center gap-2 border-2 border-border hover:border-primary/50 hover:bg-secondary text-foreground font-medium py-2 px-4 rounded-lg transition-all mb-4">
          <Mail className="h-4 w-4" />
          Schedule Email Report
        </button>

        {/* Info */}
        <div className="bg-secondary/50 rounded-lg p-3 text-xs text-muted-foreground">
          <p className="font-medium mb-1">💡 Quick Tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>CSV works great in Excel/Sheets</li>
            <li>PDF keeps formatting intact</li>
            <li>JSON for system integration</li>
            <li>Blur balances for social privacy</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
