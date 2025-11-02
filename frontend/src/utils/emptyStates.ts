/**
 * Enhanced Empty States Utilities
 * Actionable empty states with illustrations and guided user journeys
 */

import type { EnhancedEmptyState, EmptyStateType, EmptyStateAction } from '../types/emptyStates'

/**
 * Create empty state with actions and illustrations
 */
export const createEmptyState = (
  type: EmptyStateType,
  overrides?: Partial<EnhancedEmptyState>
): EnhancedEmptyState => {
  const baseStates: Record<EmptyStateType, EnhancedEmptyState> = {
    no_signals: {
      type: 'no_signals',
      title: '🎯 No signals yet',
      description: 'Your ML models haven\'t generated any trading signals yet. Start by enabling a strategy or waiting for market conditions to match your criteria.',
      illustration: getSignalIllustration(),
      illustrationAlt: 'Empty signals panel with animated chart',
      actions: [
        {
          id: 'generate-signal',
          label: 'Generate Your First Signal',
          description: 'Enable an ML model to start receiving signals',
          variant: 'primary',
          onClick: () => console.log('Navigate to signals setup'),
        },
        {
          id: 'learn-signals',
          label: 'Learn About Signals',
          variant: 'outline',
          onClick: () => console.log('Open signals tutorial'),
        },
      ],
      tips: [
        '💡 Signals work best with 2+ weeks of market data',
        '⚡ The ML model needs market volatility to generate signals',
        '🎓 Start with the "Conservative" strategy for fewer, higher-confidence signals',
      ],
      estimatedTime: '~2 seconds to first signal',
      showFilledStatePreview: true,
      metadata: { context: 'signals_panel', isFirstTime: true },
    },
    no_trades: {
      type: 'no_trades',
      title: '📊 Ready for your first trade?',
      description: 'You haven\'t placed any trades yet. Start with a paper trade to practice before trading with real capital.',
      illustration: getTradingIllustration(),
      illustrationAlt: 'Trading interface with paper money',
      actions: [
        {
          id: 'first-trade',
          label: 'Place Your First Paper Trade',
          description: 'Interactive tutorial with step-by-step guidance',
          color: 'success',
          variant: 'primary',
          onClick: () => console.log('Start first trade tutorial'),
        },
        {
          id: 'exchange-setup',
          label: 'Connect Your Exchange',
          variant: 'secondary',
          onClick: () => console.log('Open exchange setup'),
        },
      ],
      tips: [
        '📝 Paper trades don\'t use real capital - perfect for learning',
        '⏱️ Markets are most liquid during regular trading hours',
        '🔐 Always use stop-losses to manage risk',
      ],
      estimatedTime: '~5 minutes for first trade',
      showFilledStatePreview: true,
    },
    no_positions: {
      type: 'no_positions',
      title: '💼 Your portfolio is empty',
      description: 'You don\'t have any open positions yet. Place a trade to start building your portfolio.',
      illustration: getPortfolioIllustration(),
      illustrationAlt: 'Empty portfolio dashboard',
      actions: [
        {
          id: 'place-trade',
          label: 'Open a Position',
          variant: 'primary',
          onClick: () => console.log('Navigate to trading'),
        },
      ],
      tips: [
        '📈 Diversification reduces risk',
        '⏳ Long-term positions benefit from compound growth',
      ],
    },
    no_orders: {
      type: 'no_orders',
      title: '📋 No pending orders',
      description: 'All your orders have been filled or cancelled. Your portfolio is fully settled.',
      illustration: getOrdersIllustration(),
      illustrationAlt: 'Completed orders illustration',
      actions: [
        {
          id: 'place-order',
          label: 'Place a New Order',
          variant: 'primary',
          onClick: () => console.log('Open order entry'),
        },
      ],
    },
    no_watchlist: {
      type: 'no_watchlist',
      title: '⭐ Your watchlist is empty',
      description: 'Add assets you want to monitor closely. Your watchlist helps you stay updated on assets you care about.',
      illustration: getWatchlistIllustration(),
      illustrationAlt: 'Watchlist with favorite assets',
      actions: [
        {
          id: 'add-watchlist',
          label: 'Add Your First Asset',
          variant: 'primary',
          onClick: () => console.log('Open asset selector'),
        },
        {
          id: 'browse-assets',
          label: 'Browse Popular Assets',
          variant: 'outline',
          onClick: () => console.log('Show asset catalog'),
        },
      ],
      tips: [
        '⚡ Add high-volatility assets to your watchlist for trading opportunities',
        '🎯 Group assets by category (stocks, crypto, forex)',
      ],
    },
    no_data: {
      type: 'no_data',
      title: '🔗 No data connected',
      description: 'Connect your first exchange or data source to start receiving market data.',
      illustration: getConnectionIllustration(),
      illustrationAlt: 'Exchange connection setup',
      actions: [
        {
          id: 'connect-exchange',
          label: 'Connect Your First Exchange',
          description: 'Setup wizard - takes ~2 minutes',
          color: 'primary',
          variant: 'primary',
          onClick: () => console.log('Start exchange setup wizard'),
        },
        {
          id: 'demo-mode',
          label: 'Use Demo Data',
          variant: 'secondary',
          onClick: () => console.log('Enable demo data'),
        },
      ],
      tips: [
        '🔐 Your API keys are encrypted and never stored in plain text',
        '📊 Demo mode uses historical data for learning',
      ],
      estimatedTime: '~2 minutes to connect',
      metadata: { isFirstTime: true },
    },
    no_connection: {
      type: 'no_connection',
      title: '📡 Connection Error',
      description: 'Unable to connect to your exchange or data provider. Check your internet connection and API keys.',
      illustration: getErrorIllustration(),
      illustrationAlt: 'Connection error with retry option',
      actions: [
        {
          id: 'retry',
          label: 'Retry Connection',
          color: 'info',
          variant: 'primary',
          onClick: () => console.log('Retry connection'),
        },
        {
          id: 'troubleshoot',
          label: 'Troubleshooting Guide',
          variant: 'outline',
          onClick: () => console.log('Open help article'),
        },
      ],
    },
    no_activity: {
      type: 'no_activity',
      title: '📭 No recent activity',
      description: 'Your trading activity log is empty. Once you place trades, you\'ll see them here.',
      illustration: getActivityIllustration(),
      illustrationAlt: 'Activity log example',
      actions: [],
    },
    no_analytics: {
      type: 'no_analytics',
      title: '📊 Analytics coming soon',
      description: 'Once you complete some trades, detailed analytics will appear here.',
      illustration: getAnalyticsIllustration(),
      illustrationAlt: 'Analytics dashboard preview',
      actions: [
        {
          id: 'place-trade',
          label: 'Place Your First Trade',
          variant: 'primary',
          onClick: () => console.log('Start trading'),
        },
      ],
    },
  }

  return { ...baseStates[type], ...overrides }
}

/**
 * Get SVG illustration for signals
 */
export const getSignalIllustration = (): string => `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
      .pulse { animation: pulse 2s infinite }
      @keyframes draw { from { stroke-dashoffset: 300 } to { stroke-dashoffset: 0 } }
      .draw { stroke-dasharray: 300; animation: draw 3s ease-in-out }
    </style>
  </defs>
  <rect width="200" height="200" fill="#f8fafc" rx="16"/>
  <g transform="translate(50, 40)">
    <!-- Chart line -->
    <polyline points="0,80 20,60 40,70 60,40 80,50 100,20" 
              stroke="#3b82f6" stroke-width="3" fill="none" class="draw"/>
    <!-- Grid -->
    <line x1="0" y1="90" x2="100" y2="90" stroke="#e2e8f0" stroke-width="1" opacity="0.5"/>
    <line x1="0" y1="70" x2="100" y2="70" stroke="#e2e8f0" stroke-width="1" opacity="0.5"/>
    <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" stroke-width="1" opacity="0.5"/>
    <!-- Signal dot -->
    <circle cx="60" cy="40" r="4" fill="#10b981" class="pulse"/>
  </g>
  <text x="100" y="150" font-size="14" text-anchor="middle" fill="#64748b" font-family="system-ui">
    Generate signals
  </text>
</svg>
`

/**
 * Get SVG illustration for trading
 */
export const getTradingIllustration = (): string => `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @keyframes flip { 0%, 100% { transform: scaleX(1) } 50% { transform: scaleX(-1) } }
      .flip { animation: flip 3s ease-in-out infinite }
    </style>
  </defs>
  <rect width="200" height="200" fill="#f8fafc" rx="16"/>
  <!-- Money icon -->
  <g transform="translate(50, 40)" class="flip">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" stroke-width="2"/>
    <text x="50" y="60" font-size="36" text-anchor="middle" fill="#f59e0b" font-family="system-ui">$</text>
  </g>
  <!-- Arrow -->
  <path d="M 60 130 L 140 130" stroke="#3b82f6" stroke-width="2" fill="none"/>
  <polygon points="140,130 130,125 135,135" fill="#3b82f6"/>
  <text x="100" y="165" font-size="14" text-anchor="middle" fill="#64748b" font-family="system-ui">
    Paper trading
  </text>
</svg>
`

/**
 * Get SVG illustration for portfolio
 */
export const getPortfolioIllustration = (): string => `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f8fafc" rx="16"/>
  <!-- Briefcase -->
  <g transform="translate(60, 40)">
    <path d="M 10 20 L 10 70 Q 10 80 20 80 L 80 80 Q 90 80 90 70 L 90 20" 
          stroke="#8b5cf6" stroke-width="2" fill="none"/>
    <rect x="30" y="10" width="40" height="15" rx="2" stroke="#8b5cf6" stroke-width="2" fill="none"/>
    <!-- Inside elements -->
    <line x1="20" y1="40" x2="80" y2="40" stroke="#e2e8f0" stroke-width="1" opacity="0.5"/>
    <line x1="20" y1="55" x2="80" y2="55" stroke="#e2e8f0" stroke-width="1" opacity="0.5"/>
  </g>
  <text x="100" y="155" font-size="14" text-anchor="middle" fill="#64748b" font-family="system-ui">
    Build portfolio
  </text>
</svg>
`

/**
 * Get SVG illustration for connection
 */
export const getConnectionIllustration = (): string => `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @keyframes connect { 0%, 100% { opacity: 0.3 } 50% { opacity: 1 } }
      .connect { animation: connect 2s infinite }
    </style>
  </defs>
  <rect width="200" height="200" fill="#f8fafc" rx="16"/>
  <!-- Left box -->
  <rect x="30" y="50" width="40" height="40" rx="4" stroke="#3b82f6" stroke-width="2" fill="none"/>
  <!-- Right box -->
  <rect x="130" y="50" width="40" height="40" rx="4" stroke="#10b981" stroke-width="2" fill="none"/>
  <!-- Connection lines -->
  <line x1="70" y1="70" x2="130" y2="70" stroke="#3b82f6" stroke-width="2" class="connect"/>
  <circle cx="85" cy="70" r="3" fill="#3b82f6"/>
  <circle cx="115" cy="70" r="3" fill="#3b82f6"/>
  <text x="100" y="150" font-size="14" text-anchor="middle" fill="#64748b" font-family="system-ui">
    Connect exchange
  </text>
</svg>
`

/**
 * Get SVG illustration for error
 */
export const getErrorIllustration = (): string => `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f8fafc" rx="16"/>
  <!-- Connection broken -->
  <circle cx="100" cy="80" r="35" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.5"/>
  <line x1="70" y1="110" x2="130" y2="50" stroke="#ef4444" stroke-width="3" opacity="0.7"/>
  <text x="100" y="155" font-size="14" text-anchor="middle" fill="#64748b" font-family="system-ui">
    Connection error
  </text>
</svg>
`

/**
 * Get SVG illustration for watchlist
 */
export const getWatchlistIllustration = (): string => `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f8fafc" rx="16"/>
  <g transform="translate(60, 50)">
    <star points and animation would go here />
    <path d="M 40 0 L 48 18 L 68 18 L 52 30 L 60 48 L 40 36 L 20 48 L 28 30 L 12 18 L 32 18 Z"
          fill="none" stroke="#fbbf24" stroke-width="2"/>
  </g>
  <text x="100" y="155" font-size="14" text-anchor="middle" fill="#64748b" font-family="system-ui">
    Add favorites
  </text>
</svg>
`

/**
 * Get SVG illustration for activity
 */
export const getActivityIllustration = (): string => `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f8fafc" rx="16"/>
  <!-- Log entries -->
  <g transform="translate(50, 50)">
    <line x1="0" y1="0" x2="100" y2="0" stroke="#e2e8f0" stroke-width="2"/>
    <circle cx="5" cy="0" r="3" fill="#3b82f6" opacity="0.3"/>
    <line x1="0" y1="20" x2="100" y2="20" stroke="#e2e8f0" stroke-width="2"/>
    <circle cx="5" cy="20" r="3" fill="#3b82f6" opacity="0.3"/>
    <line x1="0" y1="40" x2="100" y2="40" stroke="#e2e8f0" stroke-width="2"/>
    <circle cx="5" cy="40" r="3" fill="#3b82f6" opacity="0.3"/>
  </g>
  <text x="100" y="155" font-size="14" text-anchor="middle" fill="#64748b" font-family="system-ui">
    Activity log
  </text>
</svg>
`

/**
 * Get SVG illustration for analytics
 */
export const getAnalyticsIllustration = (): string => `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f8fafc" rx="16"/>
  <g transform="translate(40, 50)">
    <!-- Bar chart -->
    <rect x="0" y="50" width="12" height="30" fill="#3b82f6" opacity="0.7"/>
    <rect x="18" y="40" width="12" height="40" fill="#3b82f6" opacity="0.7"/>
    <rect x="36" y="30" width="12" height="50" fill="#3b82f6" opacity="0.7"/>
    <rect x="54" y="20" width="12" height="60" fill="#3b82f6" opacity="0.7"/>
    <!-- Axis -->
    <line x1="0" y1="80" x2="66" y2="80" stroke="#94a3b8" stroke-width="1"/>
    <line x1="0" y1="0" x2="0" y2="80" stroke="#94a3b8" stroke-width="1"/>
  </g>
  <text x="100" y="155" font-size="14" text-anchor="middle" fill="#64748b" font-family="system-ui">
    Your analytics
  </text>
</svg>
`

/**
 * Get filled state preview
 */
export const getFilledStatePreview = (type: EmptyStateType) => {
  const previews: Record<EmptyStateType, string> = {
    no_signals: 'Your first signal will appear here with confidence level, strategy, and recommended action.',
    no_trades: 'Your completed trades will show entry price, exit price, P&L, and duration.',
    no_positions: 'Active positions show current value, P&L, allocation %, and quick actions.',
    no_orders: 'Pending orders display type, quantity, price, and time in force.',
    no_watchlist: 'Your starred assets appear here with current price, change %, and 1-day chart.',
    no_data: 'Real-time market data will stream from your connected exchange.',
    no_connection: 'Your connection status and data freshness will display here.',
    no_activity: 'A timeline of all your trading actions and system events.',
    no_analytics: 'Performance charts, returns distribution, and trading statistics.',
  }
  return previews[type]
}

/**
 * Create action handlers
 */
export const createEmptyStateHandlers = (context: string) => ({
  generateSignal: () => console.log(`Generate signal from ${context}`),
  placeFirstTrade: () => console.log(`Place first trade from ${context}`),
  connectExchange: () => console.log(`Connect exchange from ${context}`),
  addWatchlist: () => console.log(`Add to watchlist from ${context}`),
  retryConnection: () => console.log(`Retry connection from ${context}`),
})
