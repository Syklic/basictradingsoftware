/**
 * Animation Utilities
 * Reusable animation functions and timing configurations
 */

/**
 * Animation Duration Presets (milliseconds)
 */
export const ANIMATION_DURATIONS = {
  // Quick interactions
  QUICK: 100,
  TOOLTIP: 100,

  // Standard transitions
  STANDARD: 200,
  SLIDE: 250,
  FADE: 200,

  // Medium duration
  MEDIUM: 300,
  MODAL: 300,
  PAGE: 300,

  // Slower animations
  SLOW: 500,
  COMPLEX: 600,
} as const

/**
 * Animation Easing Functions
 */
export const EASING = {
  // Standard easing
  LINEAR: 'linear',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',

  // Custom cubic-bezier
  SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  SPRING: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  DECELERATE: 'cubic-bezier(0, 0, 0.2, 1)',
} as const

/**
 * Animate a number value from one to another (counter/odometer effect)
 */
export const animateNumber = (
  element: HTMLElement,
  startValue: number,
  endValue: number,
  duration: number = 1000,
  formatter?: (value: number) => string
) => {
  const startTime = performance.now()
  const difference = endValue - startValue

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const easeOutQuad = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
    const currentValue = startValue + difference * easeOutQuad

    if (element) {
      element.textContent = formatter ? formatter(currentValue) : Math.round(currentValue).toString()
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

/**
 * Trigger a pulse animation
 */
export const triggerPulse = (element: HTMLElement, duration: number = 600) => {
  element.style.animation = `none`
  // Trigger reflow to restart animation
  void element.offsetWidth
  element.style.animation = `pulse ${duration}ms cubic-bezier(0.4, 0, 0.6, 1) infinite`
  return () => {
    element.style.animation = 'none'
  }
}

/**
 * Trigger a shake animation (for alerts)
 */
export const triggerShake = (element: HTMLElement, duration: number = 400) => {
  element.style.animation = `none`
  void element.offsetWidth
  element.style.animation = `shake ${duration}ms cubic-bezier(0.36, 0, 0.66, -0.56)`
  setTimeout(() => {
    element.style.animation = 'none'
  }, duration)
}

/**
 * Trigger a glow animation
 */
export const triggerGlow = (element: HTMLElement, color: string = '#3b82f6', duration: number = 600) => {
  element.style.animation = `none`
  void element.offsetWidth
  element.style.animation = `glow-effect ${duration}ms ease-out`
  element.style.setProperty('--glow-color', color)
  setTimeout(() => {
    element.style.animation = 'none'
  }, duration)
}

/**
 * Trigger a bounce animation
 */
export const triggerBounce = (element: HTMLElement, duration: number = 500) => {
  element.style.animation = `none`
  void element.offsetWidth
  element.style.animation = `bounce ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`
  setTimeout(() => {
    element.style.animation = 'none'
  }, duration)
}

/**
 * Trigger a slide-in animation
 */
export const triggerSlideIn = (
  element: HTMLElement,
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  duration: number = 300
) => {
  element.style.animation = `none`
  void element.offsetWidth
  element.style.animation = `slideIn${direction.charAt(0).toUpperCase() + direction.slice(1)} ${duration}ms ${EASING.SMOOTH}`
  setTimeout(() => {
    element.style.animation = 'none'
  }, duration)
}

/**
 * Trigger a fade-in animation
 */
export const triggerFadeIn = (element: HTMLElement, duration: number = 300) => {
  element.style.animation = `none`
  void element.offsetWidth
  element.style.animation = `fadeIn ${duration}ms ${EASING.SMOOTH}`
  setTimeout(() => {
    element.style.animation = 'none'
  }, duration)
}

/**
 * Trigger a scale animation
 */
export const triggerScale = (
  element: HTMLElement,
  startScale: number = 0.8,
  duration: number = 300
) => {
  element.style.animation = `none`
  void element.offsetWidth
  element.style.setProperty('--start-scale', startScale.toString())
  element.style.animation = `scaleIn ${duration}ms ${EASING.SPRING}`
  setTimeout(() => {
    element.style.animation = 'none'
  }, duration)
}

/**
 * Trigger a flip animation
 */
export const triggerFlip = (element: HTMLElement, duration: number = 600) => {
  element.style.animation = `none`
  void element.offsetWidth
  element.style.animation = `flip ${duration}ms ${EASING.SMOOTH}`
  setTimeout(() => {
    element.style.animation = 'none'
  }, duration)
}

/**
 * Trigger shimmer/loading wave animation
 */
export const triggerShimmer = (element: HTMLElement, duration: number = 1500) => {
  element.style.animation = `none`
  void element.offsetWidth
  element.style.animation = `shimmer ${duration}ms infinite`
}

/**
 * Stop shimmer animation
 */
export const stopShimmer = (element: HTMLElement) => {
  element.style.animation = 'none'
}

/**
 * Get animation CSS string for use in style attributes
 */
export const getAnimationCSS = (
  name: string,
  duration: number,
  easing: string = EASING.SMOOTH,
  delay: number = 0
): string => {
  return `${name} ${duration}ms ${easing} ${delay}ms`
}

/**
 * Create a spring animation effect using transform
 */
export const createSpringEffect = (
  element: HTMLElement,
  from: { x?: number; y?: number; scale?: number },
  to: { x?: number; y?: number; scale?: number } = { x: 0, y: 0, scale: 1 },
  duration: number = 600
) => {
  const fromX = from.x ?? 0
  const fromY = from.y ?? 0
  const fromScale = from.scale ?? 1
  const toX = to.x ?? 0
  const toY = to.y ?? 0
  const toScale = to.scale ?? 1

  const start = performance.now()

  const animate = (time: number) => {
    const progress = Math.min((time - start) / duration, 1)
    // Spring easing
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

    const x = fromX + (toX - fromX) * eased
    const y = fromY + (toY - fromY) * eased
    const scale = fromScale + (toScale - fromScale) * eased

    element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

/**
 * Create a smooth value transition
 */
export const createValueTransition = (
  startValue: number,
  endValue: number,
  duration: number,
  onUpdate: (value: number) => void,
  easing: (t: number) => number = (t) => t
) => {
  const startTime = performance.now()
  const difference = endValue - startValue

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easing(progress)

    onUpdate(startValue + difference * easedProgress)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

/**
 * Easing function factory
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 - Math.pow(1 - t, 5),
  easeOutBounce: (t: number) => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  },
}
