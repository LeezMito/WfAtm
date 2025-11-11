import { ButtonKind } from './button-styles.interface'

export type FieldType = 'input' | 'textarea' | 'select' | 'file' | 'checkbox' | 'button'

export interface SelectOption {
  value: string | number | boolean
  label: string
}

export interface FieldConfig {
  key: string
  tipo: FieldType
  label: string
  value?: unknown
  placeholder?: string
  isRequired?: boolean
  maxLength?: number
  minLength?: number
  maxValue?: number
  minValue?: number
  fileExt?: string[]
  options?: ReadonlyArray<SelectOption>
  disabled?: boolean

  style?: ButtonKind
  icon?: string
  confirm?: string
  align?: 'left' | 'center' | 'right'
  colSpan?: 1 | 2 | 3
}
