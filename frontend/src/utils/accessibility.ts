/**
 * Accessibility Utilities
 * WCAG 2.1 AA compliance helpers and utilities
 */

/**
 * Keyboard navigation constants
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  A: 'a',
  K: 'k',
} as const

/**
 * Check if event is an activation key (Enter or Space)
 */
export const isActivationKey = (event: KeyboardEvent): boolean => {
  return event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE
}

/**
 * Check if event is an arrow key
 */
export const isArrowKey = (event: KeyboardEvent): boolean => {
  return (
    event.key === KEYBOARD_KEYS.ARROW_UP ||
    event.key === KEYBOARD_KEYS.ARROW_DOWN ||
    event.key === KEYBOARD_KEYS.ARROW_LEFT ||
    event.key === KEYBOARD_KEYS.ARROW_RIGHT
  )
}

/**
 * Navigate through a list of elements with arrow keys
 */
export const handleArrowNavigation = (
  event: KeyboardEvent,
  elements: HTMLElement[],
  currentIndex: number
): number | null => {
  if (!isArrowKey(event)) {
    return null
  }

  event.preventDefault()
  let newIndex = currentIndex

  switch (event.key) {
    case KEYBOARD_KEYS.ARROW_DOWN:
    case KEYBOARD_KEYS.ARROW_RIGHT:
      newIndex = (currentIndex + 1) % elements.length
      break
    case KEYBOARD_KEYS.ARROW_UP:
    case KEYBOARD_KEYS.ARROW_LEFT:
      newIndex = (currentIndex - 1 + elements.length) % elements.length
      break
    case KEYBOARD_KEYS.HOME:
      newIndex = 0
      break
    case KEYBOARD_KEYS.END:
      newIndex = elements.length - 1
      break
  }

  elements[newIndex]?.focus()
  return newIndex
}

/**
 * Create ARIA label for numeric values
 */
export const createAriaLabel = (
  label: string,
  value: number | string,
  unit?: string
): string => {
  return `${label}: ${value}${unit ? ` ${unit}` : ''}`
}

/**
 * Create ARIA label for currency
 */
export const createAriaLabelCurrency = (label: string, value: number): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
  return `${label}: ${formatted}`
}

/**
 * Create ARIA label for percentage
 */
export const createAriaLabelPercent = (label: string, value: number): string => {
  return `${label}: ${value.toFixed(2)} percent`
}

/**
 * Get appropriate ARIA live region politeness
 */
export const getAriaLive = (priority: 'low' | 'medium' | 'high'): 'polite' | 'assertive' => {
  return priority === 'high' ? 'assertive' : 'polite'
}

/**
 * Create accessible button with keyboard support
 */
export const createAccessibleButton = (
  element: HTMLElement,
  onClick: () => void,
  ariaLabel?: string
): void => {
  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel)
  }

  element.setAttribute('role', 'button')
  element.setAttribute('tabindex', '0')

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isActivationKey(e)) {
      e.preventDefault()
      onClick()
    }
  }

  const handleClick = () => onClick()

  element.addEventListener('keydown', handleKeyDown)
  element.addEventListener('click', handleClick)
}

/**
 * Create accessible checkbox
 */
export const createAccessibleCheckbox = (
  element: HTMLElement,
  checked: boolean,
  onChange: (checked: boolean) => void,
  label: string
): void => {
  element.setAttribute('role', 'checkbox')
  element.setAttribute('aria-checked', checked.toString())
  element.setAttribute('aria-label', label)
  element.setAttribute('tabindex', '0')

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isActivationKey(e)) {
      e.preventDefault()
      onChange(!checked)
      element.setAttribute('aria-checked', (!checked).toString())
    }
  }

  element.addEventListener('keydown', handleKeyDown)
}

/**
 * Get color for colorblind-friendly palette
 */
export const getColorblindFriendlyColor = (
  type: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange'
): string => {
  const palette = {
    red: '#E63946', // High red
    green: '#2A9D8F', // Teal
    blue: '#457B9D', // Slate blue
    yellow: '#F4A261', // Orange-yellow
    purple: '#9D4EDD', // Purple
    orange: '#FB8500', // Deep orange
  }
  return palette[type]
}

/**
 * Check if element is visible to screen readers
 */
export const isVisibleToScreenReaders = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element)
  const ariaHidden = element.getAttribute('aria-hidden')

  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    ariaHidden !== 'true' &&
    !element.hasAttribute('disabled')
  )
}

/**
 * Focus element and announce to screen readers
 */
export const focusAndAnnounce = (
  element: HTMLElement,
  announcement: string
): void => {
  const ariaLive = document.createElement('div')
  ariaLive.setAttribute('aria-live', 'polite')
  ariaLive.setAttribute('aria-atomic', 'true')
  ariaLive.className = 'sr-only'
  ariaLive.textContent = announcement

  document.body.appendChild(ariaLive)
  element.focus()

  setTimeout(() => {
    ariaLive.remove()
  }, 1000)
}

/**
 * Create live region for dynamic updates
 */
export const createLiveRegion = (
  id: string,
  politeness: 'polite' | 'assertive' = 'polite'
): HTMLElement => {
  const region = document.createElement('div')
  region.id = id
  region.setAttribute('aria-live', politeness)
  region.setAttribute('aria-atomic', 'true')
  region.className = 'sr-only'
  document.body.appendChild(region)
  return region
}

/**
 * Update live region with announcement
 */
export const announceLiveRegion = (regionId: string, message: string): void => {
  const region = document.getElementById(regionId)
  if (region) {
    region.textContent = message
  }
}

/**
 * Calculate contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getRelativeLuminance(color1)
  const lum2 = getRelativeLuminance(color2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Calculate relative luminance for contrast ratio
 */
const getRelativeLuminance = (color: string): number => {
  const rgb = hexToRgb(color)
  if (!rgb) return 0

  const [r, g, b] = rgb.map((c) => {
    const c_norm = c / 255
    return c_norm <= 0.03928 ? c_norm / 12.92 : Math.pow((c_norm + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Convert hex color to RGB
 */
const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null
}

/**
 * Check if contrast ratio meets WCAG AA standard (4.5:1 for normal text)
 */
export const meetsWCAGAA = (ratio: number, isLargeText: boolean = false): boolean => {
  // Normal text: 4.5:1, Large text: 3:1
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if user prefers dark mode
 */
export const prefersDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Screen reader only styles (sr-only class reference)
 */
export const SR_ONLY_STYLES = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`
