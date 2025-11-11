export type LiteralUnion<T extends string> = T | (string & Record<never, never>)

export type TableActionStyle = LiteralUnion<'primary' | 'secondary' | 'accent'>
export type TableButtonAppearance = LiteralUnion<'outline' | 'fill'>

export interface TableColumn {
  key: string
  title: string
  class?: string
  sorted?: boolean
  includeInFilter?: boolean
  pipe?: LiteralUnion<'number' | 'date' | 'uppercase' | 'lowercase' | 'currency'>
}

export interface TableAction {
  label: string
  type: TableActionStyle
  icon?: string
  appearance?: TableButtonAppearance
  id?: string
}

export type RowLike = Record<string, unknown>
