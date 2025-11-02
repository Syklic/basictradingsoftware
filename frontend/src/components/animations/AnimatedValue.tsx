import { useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { animateNumber } from '../../utils/animations'

interface AnimatedValueProps {
  value: number
  previousValue?: number
  duration?: number
  formatter?: (value: number) => string
  showTrend?: boolean
  className?: string
  showIcon?: boolean
}

/**
 * Animated Value Component
 * Displays numbers with smooth counter animation and trend indicators
 */
export default function AnimatedValue({
  value,
  previousValue,
  duration = 800,
  formatter,
  showTrend = true,
  className = '',
  showIcon = true,
}: AnimatedValueProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const hasIncreased = previousValue !== undefined && value > previousValue
  const hasDecreased = previousValue !== undefined && value < previousValue

  useEffect(() => {
    if (ref.current && previousValue !== undefined && previousValue !== value) {
      animateNumber(ref.current, previousValue, value, duration, formatter)
    } else if (ref.current) {
      ref.current.textContent = formatter
        ? formatter(value)
        : Math.round(value).toString()
    }
  }, [value, previousValue, duration, formatter])

  // Trigger flash animation
  useEffect(() => {
    if (ref.current && (hasIncreased || hasDecreased)) {
      ref.current.style.animation = 'none'
      void ref.current.offsetWidth // Trigger reflow
      ref.current.style.animation = `${hasIncreased ? 'greenFlash' : 'redFlash'} 600ms ease-out`
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.animation = 'none'
        }
      }, 600)
    }
  }, [hasIncreased, hasDecreased])

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span
        ref={ref}
        className={`font-semibold ${
          hasIncreased
            ? 'text-green-600'
            : hasDecreased
              ? 'text-red-600'
              : 'text-foreground'
        }`}
      >
        {formatter ? formatter(value) : Math.round(value).toString()}
      </span>

      {showTrend && showIcon && (
        <>
          {hasIncreased && (
            <TrendingUp className="h-4 w-4 text-green-600 animate-arrowUp" />
          )}
          {hasDecreased && (
            <TrendingDown className="h-4 w-4 text-red-600 animate-arrowDown" />
          )}
        </>
      )}
    </div>
  )
}
