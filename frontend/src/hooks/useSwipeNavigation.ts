/**
 * useSwipeNavigation Hook
 * Handle swipe gestures for navigating between sections
 */

import { useEffect, useRef } from 'react'
import { detectSwipe } from '../utils/touch'

interface UseSwipeNavigationProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  enabled?: boolean
  minVelocity?: number
}

/**
 * Custom hook for swipe navigation
 */
export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  enabled = true,
  minVelocity = 0.5,
}: UseSwipeNavigationProps) => {
  const touchStartRef = useRef<Touch | null>(null)
  const touchStartTimeRef = useRef<number>(0)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !elementRef.current) {
      return
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = e.touches[0]
        touchStartTimeRef.current = Date.now()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || e.changedTouches.length === 0) {
        return
      }

      const endTouch = e.changedTouches[0]
      const duration = Date.now() - touchStartTimeRef.current

      const swipe = detectSwipe(touchStartRef.current, endTouch, duration)

      if (swipe && swipe.velocity >= minVelocity) {
        switch (swipe.direction) {
          case 'left':
            onSwipeLeft?.()
            break
          case 'right':
            onSwipeRight?.()
            break
          case 'up':
            onSwipeUp?.()
            break
          case 'down':
            onSwipeDown?.()
            break
        }
      }

      touchStartRef.current = null
    }

    const element = elementRef.current
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minVelocity])

  return elementRef
}
