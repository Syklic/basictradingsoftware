/**
 * Common Component Props
 * Reusable prop interfaces for consistent component APIs
 */

/**
 * Props for components that can be closed
 */
export interface CloseableProps {
  onClose: () => void
}

/**
 * Props for components that can be dismissed
 */
export interface DismissableProps {
  onDismiss?: () => void
}

/**
 * Props for components that can have loading or error states
 */
export interface LoadableProps {
  isLoading?: boolean
  error?: string | null
}

/**
 * Props for components that support selection
 */
export interface SelectableProps {
  selected?: boolean
  onSelect?: () => void
}

/**
 * Props for components that support editing
 */
export interface EditableProps {
  onSave?: (data: any) => void
  onCancel?: () => void
}

/**
 * Props for modal/dialog components
 */
export interface ModalProps extends CloseableProps {
  isOpen?: boolean
  title?: string
}

/**
 * Props for form components
 */
export interface FormProps extends EditableProps {
  isLoading?: boolean
  error?: string | null
}
