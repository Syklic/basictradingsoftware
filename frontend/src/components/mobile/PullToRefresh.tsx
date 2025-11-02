import { useState, useRef, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
}

/**
 * Pull-to-Refresh Component
 * Mobile swipe-down gesture to refresh data
 */
export default function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const touchStartYRef = useRef<number>(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isScrolledToTopRef = useRef(true)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      // Only start pull if at top of container
      if (container.scrollTop === 0 && e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY
        isScrolledToTopRef.current = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolledToTopRef.current || e.touches.length !== 1) {
        return
      }

      const touchY = e.touches[0].clientY
      const distance = touchY - touchStartYRef.current

      if (distance > 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance, threshold * 1.5))
      }
    }

    const handleTouchEnd = async () => {
      if (pullDistance > threshold && !isRefreshing) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }
      setPullDistance(0)
    }

    const handleScroll = () => {
      isScrolledToTopRef.current = container.scrollTop === 0
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('scroll', handleScroll)
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh])

  const pullPercentage = (pullDistance / threshold) * 100
  const isReady = pullDistance > threshold

  return (
    <div ref={scrollContainerRef} className="h-full overflow-y-auto">
      {/* Pull-to-Refresh Header */}
      <div
        className="relative mb-2 transition-all duration-300 flex items-center justify-center"
        style={{
          height: `${Math.max(0, pullDistance)}px`,
          opacity: Math.min(pullDistance / threshold, 1),
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <RefreshCw
            className={`h-6 w-6 text-primary transition-all ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${isReady ? 180 : 0}deg)`,
              transition: 'transform 300ms ease-out',
            }}
          />
          <span className="text-xs text-muted-foreground font-medium">
            {isRefreshing
              ? 'Refreshing...'
              : isReady
                ? 'Release to refresh'
                : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${Math.max(0, pullDistance * 0.25)}px)`,
          transition: isRefreshing ? 'none' : 'transform 300ms ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}
