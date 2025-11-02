import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Play, Trophy } from 'lucide-react'
import type { Tutorial, TutorialStep, AchievementBadge } from '../../types/onboarding'

interface InteractiveTutorialProps {
  tutorial: Tutorial
  onComplete: (badges: AchievementBadge[]) => void
  onClose: () => void
}

/**
 * Interactive Tutorial Component
 * Step-by-step overlay guides with practice mode and badges
 */
export default function InteractiveTutorial({
  tutorial,
  onComplete,
  onClose,
}: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [practiceMode, setPracticeMode] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(tutorial.steps.length).fill(false)
  )
  const [showOverlay, setShowOverlay] = useState(true)

  const step = tutorial.steps[currentStep]
  const isLastStep = currentStep === tutorial.steps.length - 1
  const progressPercent = ((currentStep + 1) / tutorial.steps.length) * 100

  const handleStepComplete = () => {
    setCompletedSteps((prev) => {
      const updated = [...prev]
      updated[currentStep] = true
      return updated
    })

    if (isLastStep) {
      // Generate completion badge
      const badge: AchievementBadge = {
        id: `badge-${tutorial.id}`,
        name: `${tutorial.title} Master`,
        description: `Completed ${tutorial.title} tutorial`,
        icon: '🏆',
        unlockedAt: new Date().toISOString(),
      }
      onComplete([badge])
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay Background */}
      {showOverlay && step.overlay && (
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      )}

      {/* Tutorial Panel */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-96 max-w-md rounded-lg bg-white shadow-2xl border border-border z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex-1">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Play className="h-4 w-4 text-blue-600" />
              {tutorial.title}
            </h3>
            <div className="mt-1 text-xs text-muted-foreground">
              Step {currentStep + 1} of {tutorial.steps.length}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h4 className="font-semibold text-sm">{step.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
          </div>

          {/* Video */}
          {step.videoUrl && !practiceMode && (
            <div className="rounded-lg bg-muted aspect-video flex items-center justify-center">
              <div className="text-center">
                <Play className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Video guide available</p>
                <a
                  href={step.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                >
                  Watch video →
                </a>
              </div>
            </div>
          )}

          {/* Practice Mode Toggle */}
          {step.practiceMode?.enabled && (
            <button
              onClick={() => setPracticeMode(!practiceMode)}
              className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                practiceMode
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {practiceMode ? '✓ Practice Mode On' : 'Try Practice Mode'}
            </button>
          )}

          {/* Action Steps */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-xs font-semibold text-blue-900 mb-2">
              {practiceMode ? 'Practice Challenge:' : 'Try it:'}
            </div>
            <ul className="space-y-1">
              {step.actions.map((action, idx) => (
                <li key={idx} className="text-xs text-blue-800">
                  <span className="font-semibold">{idx + 1}.</span> {action.description}
                </li>
              ))}
            </ul>
          </div>

          {/* Tip Box */}
          {practiceMode && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="text-xs font-semibold text-green-900">💡 Tip:</div>
              <p className="text-xs text-green-800 mt-1">
                This is demo data, so all changes are temporary and won't affect real trading.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-border gap-2">
          <button
            onClick={() => {
              if (currentStep > 0) setCurrentStep(currentStep - 1)
            }}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted disabled:opacity-50"
          >
            <ChevronLeft className="h-3 w-3" />
            Back
          </button>

          <div className="text-xs text-muted-foreground">
            {completedSteps.filter(Boolean).length} / {tutorial.steps.length} complete
          </div>

          <button
            onClick={handleStepComplete}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLastStep ? 'Complete' : 'Next'}
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="px-4 pb-3 flex gap-1 flex-wrap">
          {tutorial.steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentStep
                  ? 'bg-blue-600 w-3'
                  : completedSteps[idx]
                    ? 'bg-green-600'
                    : 'bg-border'
              }`}
              title={`Step ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Target Element Highlight */}
      {showOverlay && step.overlay && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute border-2 border-yellow-400 rounded-lg shadow-lg"
            style={{
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            }}
          />
        </div>
      )}
    </div>
  )
}
