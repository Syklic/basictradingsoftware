import { useState } from 'react'
import {
  ArrowRight,
  Zap,
  Trending2,
  TrendingUp,
  Cpu,
  AlertCircle,
  Check,
  Volume2,
} from 'lucide-react'
import type {
  TradingStyle,
  AssetCategory,
  RiskTolerance,
  OnboardingProfile,
} from '../../types/onboarding'

interface WelcomeWizardProps {
  onComplete: (profile: OnboardingProfile) => void
}

/**
 * Welcome Wizard Component
 * Step-by-step onboarding for first-time users
 */
export default function WelcomeWizard({ onComplete }: WelcomeWizardProps) {
  const [step, setStep] = useState<
    'trading-style' | 'assets' | 'risk' | 'layout' | 'tour'
  >('trading-style')
  const [profile, setProfile] = useState<Partial<OnboardingProfile>>({})

  const TRADING_STYLES: { id: TradingStyle; title: string; desc: string; icon: React.ReactNode }[] =
    [
      {
        id: 'day-trader',
        title: 'Day Trader',
        desc: 'Fast-paced, multiple trades daily',
        icon: <Zap className="h-8 w-8" />,
      },
      {
        id: 'swing-trader',
        title: 'Swing Trader',
        desc: 'Hold positions for days/weeks',
        icon: <Trending2 className="h-8 w-8" />,
      },
      {
        id: 'long-term-investor',
        title: 'Long-Term Investor',
        desc: 'Hold for months/years',
        icon: <TrendingUp className="h-8 w-8" />,
      },
      {
        id: 'ml-researcher',
        title: 'ML Researcher',
        desc: 'Focus on signals & backtesting',
        icon: <Cpu className="h-8 w-8" />,
      },
    ]

  const ASSET_CATEGORIES: { id: AssetCategory; title: string; emoji: string }[] = [
    { id: 'stocks', title: 'Stocks', emoji: '📈' },
    { id: 'crypto', title: 'Crypto', emoji: '₿' },
    { id: 'forex', title: 'Forex', emoji: '💱' },
    { id: 'commodities', title: 'Commodities', emoji: '🛢️' },
    { id: 'both', title: 'Mix it Up', emoji: '🎯' },
  ]

  const RISK_TOLERANCES: { id: RiskTolerance; title: string; desc: string; color: string }[] = [
    {
      id: 'conservative',
      title: 'Conservative',
      desc: 'Prefer stability, minimize losses',
      color: 'bg-green-100 border-green-300',
    },
    {
      id: 'moderate',
      title: 'Moderate',
      desc: 'Balanced risk and reward',
      color: 'bg-blue-100 border-blue-300',
    },
    {
      id: 'aggressive',
      title: 'Aggressive',
      desc: 'Accept higher risk for returns',
      color: 'bg-orange-100 border-orange-300',
    },
    {
      id: 'very-aggressive',
      title: 'Very Aggressive',
      desc: 'Seek maximum returns',
      color: 'bg-red-100 border-red-300',
    },
  ]

  const STARTER_LAYOUTS: { id: string; title: string; desc: string }[] = [
    { id: 'day-trader', title: 'Day Trader', desc: 'Charts, orders, quick-access' },
    { id: 'investor', title: 'Long-Term', desc: 'Portfolio, analytics, charts' },
    { id: 'researcher', title: 'ML Researcher', desc: 'Signals, backtesting, charts' },
    { id: 'balanced', title: 'Balanced', desc: 'Everything at a glance' },
  ]

  const handleNext = () => {
    if (step === 'trading-style') setStep('assets')
    else if (step === 'assets') setStep('risk')
    else if (step === 'risk') setStep('layout')
    else if (step === 'layout') setStep('tour')
    else {
      onComplete({
        hasCompletedWelcome: true,
        tradingStyle: profile.tradingStyle!,
        preferredAssets: profile.preferredAssets!,
        riskTolerance: profile.riskTolerance!,
        selectedLayoutId: profile.selectedLayoutId!,
        completedAt: new Date().toISOString(),
      })
    }
  }

  const canProceed = () => {
    if (step === 'trading-style') return !!profile.tradingStyle
    if (step === 'assets') return profile.preferredAssets && profile.preferredAssets.length > 0
    if (step === 'risk') return !!profile.riskTolerance
    if (step === 'layout') return !!profile.selectedLayoutId
    return true
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 mx-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Trading Platform</h1>
          <p className="text-muted-foreground">
            Let's set up your profile in {['trading-style', 'assets', 'risk', 'layout'].includes(step) ? '4' : '5'} steps
          </p>
        </div>

        {/* Trading Style Selection */}
        {step === 'trading-style' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">What's your trading style?</h2>
            <p className="text-sm text-muted-foreground">
              We'll customize the platform to match your preferences
            </p>
            <div className="grid grid-cols-2 gap-3">
              {TRADING_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setProfile({ ...profile, tradingStyle: style.id })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    profile.tradingStyle === style.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-border bg-card hover:border-blue-300'
                  }`}
                >
                  <div className="mb-2">{style.icon}</div>
                  <div className="font-semibold text-sm">{style.title}</div>
                  <div className="text-xs text-muted-foreground">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Asset Selection */}
        {step === 'assets' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">What assets do you want to trade?</h2>
            <p className="text-sm text-muted-foreground">Select one or more</p>
            <div className="grid grid-cols-3 gap-2">
              {ASSET_CATEGORIES.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => {
                    const current = profile.preferredAssets || []
                    const updated = current.includes(asset.id)
                      ? current.filter((a) => a !== asset.id)
                      : [...current, asset.id]
                    setProfile({ ...profile, preferredAssets: updated })
                  }}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    profile.preferredAssets?.includes(asset.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-border bg-card hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{asset.emoji}</div>
                  <div className="text-sm font-medium">{asset.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Risk Tolerance */}
        {step === 'risk' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">What's your risk tolerance?</h2>
            <p className="text-sm text-muted-foreground">
              This helps us set appropriate defaults
            </p>
            <div className="space-y-2">
              {RISK_TOLERANCES.map((risk) => (
                <button
                  key={risk.id}
                  onClick={() => setProfile({ ...profile, riskTolerance: risk.id })}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    profile.riskTolerance === risk.id
                      ? `${risk.color} border-2`
                      : 'border-border bg-card hover:border-primary'
                  }`}
                >
                  <div className="font-semibold">{risk.title}</div>
                  <div className="text-sm text-muted-foreground">{risk.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Layout Selection */}
        {step === 'layout' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Choose a starter layout</h2>
            <p className="text-sm text-muted-foreground">
              You can customize this anytime
            </p>
            <div className="grid grid-cols-2 gap-3">
              {STARTER_LAYOUTS.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setProfile({ ...profile, selectedLayoutId: layout.id })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    profile.selectedLayoutId === layout.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-border bg-card hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold text-sm">{layout.title}</div>
                  <div className="text-xs text-muted-foreground">{layout.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tour Introduction */}
        {step === 'tour' && (
          <div className="space-y-6 text-center">
            <div className="text-6xl">🚀</div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">You're all set!</h2>
              <p className="text-muted-foreground mb-4">
                Let's take a quick tour of the key features to get you started
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex gap-3 mb-3">
                <Volume2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Interactive Tour</div>
                  <div className="text-xs text-muted-foreground">
                    Step-by-step guided walkthrough
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Practice Mode</div>
                  <div className="text-xs text-muted-foreground">
                    Try features with demo data first
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Earn Badges</div>
                  <div className="text-xs text-muted-foreground">
                    Complete tutorials and unlock achievements
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => {
              if (step === 'trading-style') return
              if (step === 'assets') setStep('trading-style')
              else if (step === 'risk') setStep('assets')
              else if (step === 'layout') setStep('risk')
              else if (step === 'tour') setStep('layout')
            }}
            className={`px-6 py-2 rounded-lg border border-border hover:bg-muted ${
              step === 'trading-style' ? 'text-muted-foreground cursor-not-allowed' : ''
            }`}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 'tour' ? 'Get Started' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex gap-2 justify-center">
          {['trading-style', 'assets', 'risk', 'layout', 'tour'].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                ['trading-style', 'assets', 'risk', 'layout', 'tour'].indexOf(step) >=
                ['trading-style', 'assets', 'risk', 'layout', 'tour'].indexOf(s)
                  ? 'bg-blue-600 w-8'
                  : 'bg-border w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
