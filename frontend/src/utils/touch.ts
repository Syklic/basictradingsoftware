/**
 * Touch & Gesture Utilities
 * Mobile-optimized touch and swipe gesture handlers
 */

export interface TouchPoint {
  x: number
  y: number
  time: number
}

export interface SwipeEvent {
  direction: 'up' | 'down' | 'left' | 'right'
  distance: number
  velocity: number
  startPoint: TouchPoint
  endPoint: TouchPoint
}

export interface PinchEvent {
  scale: number
  distance: number
  centerX: number
  centerY: number
}

/**
 * Detect swipe gesture
 */
export const detectSwipe = (startTouch: Touch, endTouch: Touch, time: number): SwipeEvent | null => {
  const dx = endTouch.clientX - startTouch.clientX
  const dy = endTouch.clientY - startTouch.clientY
  const distance = Math.sqrt(dx * dx + dy * dy)
  const velocity = distance / time
  const threshold = 50 // Minimum distance for swipe

  if (distance < threshold) {
    return null
  }

  let direction: 'up' | 'down' | 'left' | 'right'
  if (Math.abs(dx) > Math.abs(dy)) {
    direction = dx > 0 ? 'right' : 'left'
  } else {
    direction = dy > 0 ? 'down' : 'up'
  }

  return {
    direction,
    distance,
    velocity,
    startPoint: {
      x: startTouch.clientX,
      y: startTouch.clientY,
      time: 0,
    },
    endPoint: {
      x: endTouch.clientX,
      y: endTouch.clientY,
      time,
    },
  }
}

/**
 * Calculate pinch scale (two-finger zoom)
 */
export const calculatePinchScale = (touch1: Touch, touch2: Touch): PinchEvent => {
  const dx = touch1.clientX - touch2.clientX
  const dy = touch1.clientY - touch2.clientY
  const distance = Math.sqrt(dx * dx + dy * dy)
  const centerX = (touch1.clientX + touch2.clientX) / 2
  const centerY = (touch1.clientY + touch2.clientY) / 2

  return {
    scale: distance,
    distance,
    centerX,
    centerY,
  }
}

/**
 * Check if touch is a long press
 */
export const isLongPress = (startTime: number, currentTime: number, threshold: number = 500): boolean => {
  return currentTime - startTime > threshold
}

/**
 * Get touch velocity (for momentum calculations)
 */
export const getTouchVelocity = (startPoint: TouchPoint, endPoint: TouchPoint): { x: number; y: number } => {
  const time = Math.max(endPoint.time - startPoint.time, 1) // Avoid division by zero
  return {
    x: (endPoint.x - startPoint.x) / time,
    y: (endPoint.y - startPoint.y) / time,
  }
}

/**
 * Check if touch is within mobile viewport
 */
export const isMobileViewport = (): boolean => {
  return window.innerWidth < 768
}

/**
 * Check if device supports touch
 */
export const isTouchDevice = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    (!!navigator.maxTouchPoints ||
      !!navigator.msMaxTouchPoints ||
      //@ts-ignore
      !!navigator.touches)
  )
}

/**
 * Prevent default touch behaviors (scrolling, zooming)
 */
export const preventTouchDefault = (e: TouchEvent) => {
  e.preventDefault()
}

/**
 * Get safe area insets for notched devices
 */
export const getSafeAreaInsets = (): {
  top: number
  right: number
  bottom: number
  left: number
} => {
  if (typeof window === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 }
  }

  const root = document.documentElement
  return {
    top: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-top') || '0'),
    right: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-right') || '0'),
    bottom: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-left') || '0'),
  }
}

/**
 * Throttle touch events for performance
 */
export const createTouchThrottle = (callback: (event: TouchEvent) => void, delay: number = 16) => {
  let lastCall = 0
  let timeout: NodeJS.Timeout

  return (event: TouchEvent) => {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      callback(event)
    } else {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        lastCall = Date.now()
        callback(event)
      }, delay - (now - lastCall))
    }
  }
}

/**
 * Debounce touch events
 */
export const createTouchDebounce = (callback: (event: TouchEvent) => void, delay: number = 300) => {
  let timeout: NodeJS.Timeout

  return (event: TouchEvent) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback(event)
    }, delay)
  }
}

/**
 * Check device orientation
 */
export const getDeviceOrientation = (): 'portrait' | 'landscape' => {
  if (typeof window === 'undefined') return 'portrait'
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

/**
 * Get viewport dimensions (considering safe areas)
 */
export const getViewportDimensions = (): {
  width: number
  height: number
  safeWidth: number
  safeHeight: number
} => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0, safeWidth: 0, safeHeight: 0 }
  }

  const insets = getSafeAreaInsets()
  const width = window.innerWidth
  const height = window.innerHeight
  const safeWidth = width - insets.left - insets.right
  const safeHeight = height - insets.top - insets.bottom

  return { width, height, safeWidth, safeHeight }
}
