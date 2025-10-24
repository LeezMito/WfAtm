import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  Component,
  ViewChild,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core'

import { MatButtonModule } from '@angular/material/button'
import { MatOptionModule } from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatSelectChange, MatSelectModule } from '@angular/material/select'
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'

import { ButtonStyleDirective } from '../../directives/button/button-style.directive'
import { RowLike, TableAction, TableColumn } from '../../interfaces/table-smart.interface'

@Component({
  standalone: true,
  selector: 'app-table-smart',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    ButtonStyleDirective,
  ],
  templateUrl: './table-smart.component.html',
  styleUrl: './table-smart.component.sass',
})
export class TableSmartComponent<T extends RowLike = RowLike> implements AfterViewInit {
  rows = input<readonly T[]>([])
  columns = input.required<readonly TableColumn[]>()
  columnActions = input<readonly TableAction[]>([])

  pageSizeOptions = input<readonly number[]>([5, 10, 25])
  initialPageSize = input<number>(10)
  enableClientFiltering = input<boolean>(true)

  pdfClick = output<void>()
  xlsxClick = output<void>()
  filterChange = output<{ columns: string[]; query: string }>()
  pageChange = output<{ pageIndex: number; pageSize: number }>()
  actionClick = output<{ actionLabel: string; row: T }>()
  sortChange = output<{ active: string; direction: SortDirection }>()

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  selectedFilterColumns = signal<string[]>([])
  filterQuery = signal<string>('')

  displayedColumns = computed(() => {
    const base = Array.from(this.columns() ?? []).map((c) => c.key)
    return (this.columnActions()?.length ?? 0) > 0 ? [...base, '__actions'] : base
  })

  private _dataSource = new MatTableDataSource<T>([])

  private filteredRows = computed<readonly T[]>(() => {
    try {
      const rows = Array.from(this.rows() ?? [])
      if (!this.enableClientFiltering()) return rows

      const cols = this.selectedFilterColumns()
      const q = (this.filterQuery() || '').toLowerCase().trim()
      if (!q || cols.length === 0) return rows

      const filtered = rows.filter((r) =>
        cols.some((k) => {
          const val = (r as RowLike)[k]
          return coerceToString(val).includes(q)
        })
      )

      console.log('[ATM-TBL-FILTERED-ROWS]', {
        total: rows.length,
        filtered: filtered.length,
        cols,
        q,
      })
      return filtered
    } catch (err) {
      console.error('[ATM-TBL-FILTERED-ERROR]', err)
      return Array.from(this.rows() ?? [])
    }
  })

  constructor() {
    effect(() => {
      try {
        const data = this.filteredRows()
        this._dataSource.data = Array.from(data ?? [])
        console.log('[ATM-TBL-DATASOURCE-SET]', { size: this._dataSource.data.length })
      } catch (err) {
        console.error('[ATM-TBL-DATASOURCE-SET-ERROR]', err)
      }
    })
  }

  ngAfterViewInit() {
    try {
      this._dataSource.paginator = this.paginator
      this._dataSource.sort = this.sort

      if (this.paginator) {
        this.paginator.pageSize = this.initialPageSize()
      }

      this.sort.sortChange.subscribe((s: Sort) => {
        try {
          console.log('[ATM-TBL-SORT-CHANGE]', s)
          this.sortChange.emit({ active: s.active, direction: s.direction })
        } catch (err) {
          console.error('[ATM-TBL-SORT-CHANGE-ERROR]', err)
        }
      })
    } catch (err) {
      console.error('[ATM-TBL-AFTERVIEWINIT-ERROR]', err)
    }
  }

  get dataSource(): MatTableDataSource<T> {
    return this._dataSource
  }

  filterColumnsOptions = computed(() =>
    Array.from(this.columns() ?? []).filter((c) => c.includeInFilter)
  )

  onSelectFilterColumns(ev: MatSelectChange) {
    try {
      const value = (ev?.value as string[]) ?? []
      this.selectedFilterColumns.set(value)
      console.log('[ATM-TBL-FILTER-COLS-CHANGE]', this.selectedFilterColumns())
    } catch (err) {
      console.error('[ATM-TBL-FILTER-COLS-ERROR]', err)
    }
  }

  onInputFilterQuery(ev: Event) {
    try {
      const value = (ev.target as HTMLInputElement).value ?? ''
      this.filterQuery.set(value)
      console.log('[ATM-TBL-FILTER-QUERY-CHANGE]', value)
    } catch (err) {
      console.error('[ATM-TBL-FILTER-QUERY-ERROR]', err)
    }
  }

  onClickApplyFilters() {
    try {
      const payload = {
        columns: this.selectedFilterColumns(),
        query: this.filterQuery(),
      }
      console.log('[ATM-TBL-FILTER-CLICK]', payload)
      this.filterChange.emit(payload)
    } catch (err) {
      console.error('[ATM-TBL-FILTER-CLICK-ERROR]', err)
    }
  }

  onClickPdf() {
    try {
      console.log('[ATM-TBL-PDF-CLICK]')
      this.pdfClick.emit()
    } catch (err) {
      console.error('[ATM-TBL-PDF-CLICK-ERROR]', err)
    }
  }

  onClickXlsx() {
    try {
      console.log('[ATM-TBL-XLSX-CLICK]')
      this.xlsxClick.emit()
    } catch (err) {
      console.error('[ATM-TBL-XLSX-CLICK-ERROR]', err)
    }
  }

  onPaginatorChange(ev: PageEvent) {
    try {
      console.log('[ATM-TBL-PAGE-CHANGE]', ev)
      this.pageChange.emit({ pageIndex: ev.pageIndex, pageSize: ev.pageSize })
    } catch (err) {
      console.error('[ATM-TBL-PAGE-CHANGE-ERROR]', err)
    }
  }

  onActionBtnClick(action: TableAction, row: T) {
    try {
      console.log('[ATM-TBL-ACTION-CLICK]', { action: action?.label, row })
      this.actionClick.emit({ actionLabel: action?.label, row })
    } catch (err) {
      console.error('[ATM-TBL-ACTION-CLICK-ERROR]', err)
    }
  }

  renderCell(value: unknown, pipeName?: string): unknown {
    try {
      if (!pipeName) return value
      switch (pipeName) {
        case 'uppercase':
          return coerceToString(value).toUpperCase()
        case 'lowercase':
          return coerceToString(value).toLowerCase()
        default:
          return value
      }
    } catch {
      return value
    }
  }

  isSortable(col: TableColumn): boolean {
    return !!col.sorted
  }
}

function coerceToString(v: unknown): string {
  if (v == null) return ''
  return String(v).toLowerCase()
}
