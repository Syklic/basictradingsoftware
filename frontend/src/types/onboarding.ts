/**
 * Onboarding & Help Types
 * Type definitions for tutorials, help, and intelligent suggestions
 */

/**
 * Trading Style
 */
export type TradingStyle = 'day-trader' | 'swing-trader' | 'long-term-investor' | 'ml-researcher'

/**
 * Asset Category
 */
export type AssetCategory = 'stocks' | 'crypto' | 'forex' | 'commodities' | 'both'

/**
 * Risk Tolerance
 */
export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive' | 'very-aggressive'

/**
 * Welcome Wizard Step
 */
export interface WelcomeStep {
  id: string
  title: string
  description: string
  icon: string
}

/**
 * User Onboarding Profile
 */
export interface OnboardingProfile {
  hasCompletedWelcome: boolean
  tradingStyle: TradingStyle
  preferredAssets: AssetCategory[]
  riskTolerance: RiskTolerance
  selectedLayoutId: string
  completedAt: string
}

/**
 * Tutorial Step
 */
export interface TutorialStep {
  id: string
  title: string
  description: string
  videoUrl?: string
  overlay?: {
    targetElement: string
    position: 'top' | 'bottom' | 'left' | 'right'
    highlight: boolean
  }
  actions: {
    label: string
    description: string
  }[]
  practiceMode?: {
    enabled: boolean
    demoData: Record<string, any>
  }
}

/**
 * Tutorial
 */
export interface Tutorial {
  id: string
  title: string
  description: string
  steps: TutorialStep[]
  estimatedMinutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  videoUrl?: string
  badges?: string[]
}

/**
 * Achievement Badge
 */
export interface AchievementBadge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
  progress?: number
}

/**
 * Help Article
 */
export interface HelpArticle {
  id: string
  title: string
  content: string
  videoUrl?: string
  relatedTopics: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  keywords: string[]
}

/**
 * Keyboard Shortcut
 */
export interface KeyboardShortcut {
  keys: string[]
  action: string
  description: string
  category: 'navigation' | 'trading' | 'general'
}

/**
 * Smart Suggestion
 */
export interface SmartSuggestion {
  id: string
  type: 'warning' | 'tip' | 'achievement' | 'opportunity'
  title: string
  message: string
  action?: {
    label: string
    callback: () => void
  }
  context: string // where it applies
  dismissible: boolean
  priority: 'low' | 'medium' | 'high'
}

/**
 * Contextual Help
 */
export interface ContextualHelp {
  featureName: string
  briefExplanation: string
  detailedGuide?: string
  videoUrl?: string
  relatedFeatures: string[]
  documentationLink?: string
}

/**
 * User Progress Tracking
 */
export interface UserProgress {
  tutorialsStarted: string[]
  tutorialsCompleted: string[]
  badgesEarned: AchievementBadge[]
  totalTradesExecuted: number
  suggestionsViewed: number
  helpArticlesRead: string[]
  lastActivityAt: string
}

/**
 * Onboarding State
 */
export interface OnboardingState {
  isFirstTimeUser: boolean
  profile?: OnboardingProfile
  currentTutorialId?: string
  currentTutorialStep?: number
  progress: UserProgress
  dismissedSuggestions: string[]
}

/**
 * Tutorial Categories
 */
export const TUTORIAL_CATEGORIES = {
  GETTING_STARTED: 'getting-started',
  TRADING_BASICS: 'trading-basics',
  ADVANCED_TRADING: 'advanced-trading',
  RISK_MANAGEMENT: 'risk-management',
  ML_STRATEGIES: 'ml-strategies',
  PLATFORM_FEATURES: 'platform-features',
} as const
