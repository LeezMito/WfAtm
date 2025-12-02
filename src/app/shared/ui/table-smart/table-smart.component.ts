import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSelectChange, MatSelectModule } from '@angular/material/select'
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'

import { ButtonStyleDirective } from '../../directives/button/button-style.directive'
import { ButtonKind } from '../../interfaces/button-styles.interface'
import {
  ActionEvent,
  FilterEvent,
  RowLike,
  TableColumn,
} from '../../interfaces/table-smart.interface'

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSmartComponent<T extends RowLike = RowLike> implements AfterViewInit {
  readonly filas = input<readonly T[]>([])
  readonly columnas = input.required<readonly TableColumn[]>()

  readonly opcionesTamanoPagina = signal<readonly number[]>([5, 10, 25])
  readonly tamanoPaginaInicial = signal<number>(10)

  readonly exportarPdf = output<void>()
  readonly exportarXlsx = output<void>()
  readonly filtroAplicado = output<FilterEvent>()
  readonly accionEjecutada = output<ActionEvent>()
  readonly ordenamientoCambiado = output<{ columnaActiva: string; direccion: SortDirection }>()

  @ViewChild(MatPaginator) paginador!: MatPaginator
  @ViewChild(MatSort) ordenamiento!: MatSort

  readonly columnasFiltroSeleccionadas = signal<string[]>([])
  readonly textoBusqueda = signal<string>('')

  readonly columnasVisibles = computed(() => {
    return this.columnas().map((columna) => columna.key)
  })

  readonly columnasDisponiblesFiltro = computed(() =>
    this.columnas().filter((columna) => columna.includeInFilter)
  )

  readonly accionesFila = computed(() => {
    return this.columnas().filter((columna) => columna.haveAction)
  })

  private readonly fuenteDatosInterna = new MatTableDataSource<T>([])

  private readonly sincronizarDatosTabla = effect(() => {
    const filas = this.filas()
    this.fuenteDatosInterna.data = [...filas]
  })

  readonly fuenteDatos: MatTableDataSource<T> = this.fuenteDatosInterna

  ngAfterViewInit(): void {
    this.fuenteDatosInterna.paginator = this.paginador
    this.fuenteDatosInterna.sort = this.ordenamiento

    if (this.paginador) {
      this.paginador.pageSize = this.tamanoPaginaInicial()
      this.paginador.pageSizeOptions = [...this.opcionesTamanoPagina()]
    }

    this.ordenamiento.sortChange.subscribe((sort: Sort) => {
      this.ordenamientoCambiado.emit({
        columnaActiva: sort.active,
        direccion: sort.direction,
      })
    })
  }

  seleccionarColumnasFiltro({ value }: MatSelectChange): void {
    this.columnasFiltroSeleccionadas.set((value ?? []) as string[])
  }

  aplicarFiltros(): void {
    this.filtroAplicado.emit({
      columns: this.columnasFiltroSeleccionadas(),
      query: this.textoBusqueda(),
    })
  }

  descargarPdf(): void {
    this.exportarPdf.emit()
  }

  descargarXlsx(): void {
    this.exportarXlsx.emit()
  }

  ejecutarAccion(accion: TableColumn, row: T): void {
    this.accionEjecutada.emit({ actionLabel: accion.key, row })
  }

  formatearCelda(valor: string, nombrePipe?: string): string {
    if (!nombrePipe) return valor

    switch (nombrePipe) {
      case 'uppercase':
        return valor.toUpperCase()
      case 'lowercase':
        return valor.toLowerCase()
      default:
        return valor
    }
  }

  esColumnaOrdenable(columna: TableColumn): boolean {
    return !!columna.sorted
  }

  obtenerClasesBoton(
    appearance: 'fill' | 'outline' = 'outline',
    type: 'primary' | 'secondary' | 'accent' = 'primary'
  ): ButtonKind {
    return `${type}-${appearance}` as ButtonKind
  }
}
