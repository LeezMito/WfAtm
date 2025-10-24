import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { SortDirection } from '@angular/material/sort'
import { map } from 'rxjs/operators'
import { ButtonStyleDirective } from '../../../../shared/directives/button/button-style.directive'
import { RowLike, TableColumn } from '../../../../shared/interfaces/table-smart.interface'
import { TableSmartComponent } from '../../../../shared/ui/table-smart/table-smart.component'
import { SolicitudApi } from '../../interfaces/servicio-prueba-api.interface'
import { SolicitudesDataService } from '../../services/solicitudes-data.service'

type Row = Record<string, unknown>

type FilterEvent = { columns: string[]; query: string }
type PageEventLike = { pageIndex: number; pageSize: number }
type ActionEvent<R extends Row = Row> = { actionLabel: string; row: R }
type SortEvent = { active: string; direction: SortDirection }

@Component({
  selector: 'app-solicitud-lista-page',
  standalone: true,
  imports: [
    TableSmartComponent,
    MatHint,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonStyleDirective,
  ],
  templateUrl: './solicitud-lista-page.component.html',
  styleUrl: './solicitud-lista-page.component.sass',
})
export class SolicitudListaPageComponent implements OnInit {
  private data = inject(SolicitudesDataService)
  private readonly destroyRef = inject(DestroyRef)

  readonly loading = signal<boolean>(false)
  readonly error = signal<string | null>(null)

  readonly columns: ReadonlyArray<TableColumn> = [
    { key: 'noSolicitud', title: 'No. Solicitud', sorted: true, includeInFilter: true },
    { key: 'tipoCajero', title: 'Tipo Cajero', sorted: true, includeInFilter: true },
    { key: 'bucGrupo', title: 'BUC / Grupo', sorted: true, includeInFilter: true },
    {
      key: 'razonSocial',
      title: 'Razón Social / Nombre de Sitio',
      sorted: true,
      includeInFilter: true,
    },
    {
      key: 'totalATMs',
      title: "Total ATM's",
      sorted: false,
      includeInFilter: false,
      pipe: 'number',
      class: 'text-right',
    },
    { key: 'avanceSolicitudPct', title: 'Avance Solicitud', sorted: true, includeInFilter: false },
    { key: 'estatusSolicitud', title: 'Estatus Solicitud', sorted: true, includeInFilter: true },
    { key: 'actividadActual', title: 'Actividad Actual', sorted: false, includeInFilter: false },
    { key: 'estatusActividad', title: 'Estatus Actividad', sorted: true, includeInFilter: true },
    { key: 'banca', title: 'Banca', sorted: true, includeInFilter: true },
    { key: 'region', title: 'Región', sorted: true, includeInFilter: true },
  ] as const

  readonly rows = signal<ReadonlyArray<RowLike>>([])

  private readonly params = signal<{ estatus?: string; region?: string } | undefined>(undefined)

  tipoAtmCtl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  })

  ngOnInit() {
    this.load()
  }

  load(params?: { estatus?: string; region?: string }) {
    this.loading.set(true)
    this.error.set(null)

    this.data
      .list(params)
      .pipe(
        map((items): ReadonlyArray<SolicitudApi> => {
          if (!Array.isArray(items)) {
            throw new Error('Respuesta no es un arreglo')
          }
          return items as ReadonlyArray<SolicitudApi>
        }),
        map((items): ReadonlyArray<RowLike> => this.adapt(items)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (rows: ReadonlyArray<RowLike>) => {
          this.rows.set(rows)
          this.loading.set(false)
        },
        error: (err: unknown) => {
          console.error('[SOLIC-LISTA][LOAD-ERROR]', err)
          this.error.set('No se pudo cargar la lista de solicitudes.')
          this.loading.set(false)
        },
      })
  }

  refresh(params?: { estatus?: string; region?: string }) {
    this.data.invalidate(params)
    this.load(params)
  }

  private adapt(items: ReadonlyArray<SolicitudApi>): ReadonlyArray<RowLike> {
    return items.map((i) => ({
      ...i,
      avanceSolicitudPct: `${(i.avanceSolicitud * 100).toFixed(1)} %`,
    }))
  }

  onIniciarSolicitud(): void {
    const __tryId = 'ATM_STARTER_CARD:onIniciarSolicitud'
    try {
      if (!this.tipoAtmCtl.valid) {
        console.warn(__tryId, 'Tipo ATM inválido', this.tipoAtmCtl.value)
        this.tipoAtmCtl.markAsTouched()
        return
      }
      console.log(__tryId, 'OK -> Tipo ATM:', this.tipoAtmCtl.value)
    } catch (error) {
      console.error(__tryId, error)
    }
  }

  onPdf() {
    try {
      console.log('[PADRE-PDF]')
    } catch (e) {
      console.error(e)
    }
  }
  onXlsx() {
    try {
      console.log('[PADRE-XLSX]')
    } catch (e) {
      console.error(e)
    }
  }
  onFilter(ev: FilterEvent): void {
    try {
      console.log('[PADRE-FILTER]', ev)
    } catch (err) {
      console.error('[PADRE-FILTER-ERROR]', err)
    }
  }

  onPage(ev: PageEventLike): void {
    try {
      console.log('[PADRE-PAGE]', ev)
    } catch (err) {
      console.error('[PADRE-PAGE-ERROR]', err)
    }
  }

  onAction<R extends Row = Row>(ev: ActionEvent<R>): void {
    try {
      console.log('[PADRE-ACTION]', ev.actionLabel, ev.row)
    } catch (err) {
      console.error('[PADRE-ACTION-ERROR]', err)
    }
  }

  onSort(ev: SortEvent): void {
    try {
      console.log('[PADRE-SORT]', ev)
    } catch (err) {
      console.error('[PADRE-SORT-ERROR]', err)
    }
  }
}
