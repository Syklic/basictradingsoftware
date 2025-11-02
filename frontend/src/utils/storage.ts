/**
 * Local Storage Utility
 * Centralized place for all localStorage operations with error handling
 */

/**
 * Get a value from localStorage with type safety
 */
export const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Failed to load ${key} from storage:`, error)
    return defaultValue
  }
}

/**
 * Save a value to localStorage
 */
export const saveToStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error)
    return false
  }
}

/**
 * Remove a value from localStorage
 */
export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Failed to remove ${key} from storage:`, error)
    return false
  }
}

/**
 * Clear all localStorage
 */
export const clearStorage = (): boolean => {
  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error('Failed to clear storage:', error)
    return false
  }
}

/**
 * Check if a key exists in localStorage
 */
export const hasInStorage = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null
  } catch (error) {
    console.error(`Failed to check ${key} in storage:`, error)
    return false
  }
}
