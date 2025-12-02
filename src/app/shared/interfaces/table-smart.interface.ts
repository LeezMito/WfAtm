export type ActionStyle = 'primary' | 'secondary' | 'accent'
export type ButtonAppearance = 'outline' | 'fill'
export type ColumnPipe = 'number' | 'date' | 'uppercase' | 'lowercase' | 'currency'

export interface TableColumn {
  key: string
  title: string
  class?: string
  sorted?: boolean
  includeInFilter?: boolean
  icon?: string
  haveAction?: boolean
  buttonAppearance?: ButtonAppearance
  buttonType?: ActionStyle
  pipe?: ColumnPipe
}

export type RowLike = Record<string, unknown>

export type FilterEvent = { columns: string[]; query: string }
export type ActionEvent<R extends RowLike = RowLike> = { actionLabel: string; row: R }
