/**
 * useTemporaryMessage Hook
 * Manages temporary messages that automatically dismiss after a duration
 */

import { useState, useEffect } from 'react'

export const useTemporaryMessage = (duration = 2000) => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), duration)
      return () => clearTimeout(timer)
    }
  }, [message, duration])

  return [message, setMessage] as const
}
