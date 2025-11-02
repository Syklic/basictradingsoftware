/**
 * Undo/Redo System
 * History management for layout changes, settings, and actions
 */

import type { HistoryEntry, ActionType, UndoRedoState } from '../types/uxPatterns'

/**
 * Create undo/redo manager
 */
export class UndoRedoManager {
  private history: HistoryEntry[] = []
  private currentIndex: number = -1
  private maxSize: number = 50

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize
  }

  /**
   * Add action to history
   */
  addAction(
    action: ActionType,
    description: string,
    state: unknown,
    previousState?: unknown
  ): HistoryEntry {
    // Remove any redo history after current position
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1)
    }

    const entry: HistoryEntry = {
      id: `action-${Date.now()}-${Math.random()}`,
      action,
      timestamp: Date.now(),
      description,
      state,
      previousState,
    }

    this.history.push(entry)
    this.currentIndex++

    // Limit history size
    if (this.history.length > this.maxSize) {
      this.history.shift()
      this.currentIndex--
    }

    return entry
  }

  /**
   * Undo last action
   */
  undo(): HistoryEntry | null {
    if (this.canUndo()) {
      const entry = this.history[this.currentIndex]
      this.currentIndex--
      return entry
    }
    return null
  }

  /**
   * Redo last undone action
   */
  redo(): HistoryEntry | null {
    if (this.canRedo()) {
      this.currentIndex++
      return this.history[this.currentIndex]
    }
    return null
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.currentIndex >= 0
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  /**
   * Get current state
   */
  getCurrentState(): unknown {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex].state
    }
    return null
  }

  /**
   * Get previous state (for undo)
   */
  getPreviousState(): unknown {
    if (this.currentIndex >= 0) {
      const entry = this.history[this.currentIndex]
      return entry.previousState || null
    }
    return null
  }

  /**
   * Get undo description
   */
  getUndoDescription(): string | null {
    if (this.canUndo()) {
      return `Undo: ${this.history[this.currentIndex].description}`
    }
    return null
  }

  /**
   * Get redo description
   */
  getRedoDescription(): string | null {
    if (this.canRedo()) {
      return `Redo: ${this.history[this.currentIndex + 1].description}`
    }
    return null
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = []
    this.currentIndex = -1
  }

  /**
   * Get full history
   */
  getHistory(): HistoryEntry[] {
    return [...this.history]
  }

  /**
   * Get current index
   */
  getCurrentIndex(): number {
    return this.currentIndex
  }

  /**
   * Export state
   */
  exportState(): UndoRedoState {
    return {
      history: this.history,
      currentIndex: this.currentIndex,
      maxSize: this.maxSize,
    }
  }

  /**
   * Import state
   */
  importState(state: UndoRedoState): void {
    this.history = state.history
    this.currentIndex = state.currentIndex
    this.maxSize = state.maxSize
  }
}

/**
 * Global undo/redo managers by category
 */
const managers = {
  layout: new UndoRedoManager(50),
  settings: new UndoRedoManager(50),
  trading: new UndoRedoManager(50),
}

/**
 * Get manager for category
 */
export const getManager = (category: keyof typeof managers) => managers[category]

/**
 * Handle Ctrl+Z / Cmd+Z keyboard shortcut
 */
export const handleUndoShortcut = (event: KeyboardEvent, category?: keyof typeof managers) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const isUndoKey = (isMac ? event.metaKey : event.ctrlKey) && event.key === 'z'

  if (isUndoKey && !event.shiftKey) {
    event.preventDefault()
    if (category) {
      managers[category].undo()
    } else {
      managers.trading.undo()
    }
  }
}

/**
 * Handle Ctrl+Shift+Z / Cmd+Shift+Z keyboard shortcut
 */
export const handleRedoShortcut = (event: KeyboardEvent, category?: keyof typeof managers) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const isRedoKey = (isMac ? event.metaKey : event.ctrlKey) && event.key === 'z' && event.shiftKey
  const isRedoKeyAlt = (isMac ? event.metaKey : event.ctrlKey) && event.key === 'y'

  if ((isRedoKey || isRedoKeyAlt) && !event.altKey) {
    event.preventDefault()
    if (category) {
      managers[category].redo()
    } else {
      managers.trading.redo()
    }
  }
}

/**
 * Create undo toast message
 */
export const createUndoToast = (manager: UndoRedoManager, category: string) => {
  const description = manager.getUndoDescription()
  return {
    title: 'Action Undone',
    description,
    action: {
      label: 'Redo',
      callback: () => manager.redo(),
    },
    duration: 5000,
  }
}

/**
 * Create redo toast message
 */
export const createRedoToast = (manager: UndoRedoManager, category: string) => {
  const description = manager.getRedoDescription()
  return {
    title: 'Action Redone',
    description,
    duration: 5000,
  }
}

/**
 * Persist undo/redo state to localStorage
 */
export const persistUndoRedoState = () => {
  try {
    const state = {
      layout: managers.layout.exportState(),
      settings: managers.settings.exportState(),
      trading: managers.trading.exportState(),
    }
    localStorage.setItem('undoRedoState', JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to persist undo/redo state:', error)
  }
}

/**
 * Restore undo/redo state from localStorage
 */
export const restoreUndoRedoState = () => {
  try {
    const stored = localStorage.getItem('undoRedoState')
    if (stored) {
      const state = JSON.parse(stored)
      if (state.layout) managers.layout.importState(state.layout)
      if (state.settings) managers.settings.importState(state.settings)
      if (state.trading) managers.trading.importState(state.trading)
    }
  } catch (error) {
    console.warn('Failed to restore undo/redo state:', error)
  }
}
