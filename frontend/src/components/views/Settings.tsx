import { Settings as SettingsIcon, Info } from 'lucide-react'

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-accent" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-400">
          <strong>Note:</strong> The comprehensive settings dialog is accessed via the settings icon in the navbar or click the button below.
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Settings Categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { title: 'General Settings', desc: 'Trading mode, model selection' },
            { title: 'Risk Management', desc: 'Position sizing, daily loss limits' },
            { title: 'Notifications', desc: 'Email, sound, desktop alerts' },
            { title: 'ML Models', desc: 'Model selection and configuration' },
            { title: 'Assets', desc: 'Assets to monitor' },
            { title: 'Display', desc: 'Theme, timeframe, language' },
            { title: 'Staking', desc: 'Staking configuration' },
            { title: 'Advanced', desc: 'Webhooks, logging, rate limits' },
          ].map((category, i) => (
            <button
              key={i}
              className="text-left p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <div className="font-medium">{category.title}</div>
              <div className="text-sm text-muted-foreground">{category.desc}</div>
            </button>
          ))}
        </div>

        <button className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
          Open Full Settings
        </button>
      </div>

      {/* API Credentials Info */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">API Credentials</h2>
        <p className="text-muted-foreground mb-4">
          Securely manage your API keys for trading and data services
        </p>
        <div className="space-y-3">
          {['Alpaca API', 'Binance API', 'Data Provider'].map((api) => (
            <div key={api} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{api}</span>
              <button className="px-3 py-1 text-sm bg-card hover:bg-muted rounded transition-colors">
                Configure
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
