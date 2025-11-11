import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatOptionModule } from '@angular/material/core'
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { SortDirection } from '@angular/material/sort'
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs'
import { Router } from '@angular/router'
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
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    ButtonStyleDirective,
    MatOptionModule,
  ],
  templateUrl: './solicitud-lista-page.component.html',
  styleUrl: './solicitud-lista-page.component.sass',
})
export class SolicitudListaPageComponent implements OnInit, AfterViewInit {
  private router = inject(Router)

  private data = inject(SolicitudesDataService)
  private readonly destroyRef = inject(DestroyRef)

  private cdr = inject(ChangeDetectorRef)

  readonly loading = signal<boolean>(false)
  readonly error = signal<string | null>(null)

  @ViewChild(MatTabGroup) tabGroup?: MatTabGroup

  private _startIndex = 0

  readonly disableTabAnimation = computed(() => this.tabIndex() === 1)

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

  readonly rowsMes = signal<ReadonlyArray<RowLike>>([])
  readonly rowsPend = signal<ReadonlyArray<RowLike>>([])

  private readonly paramsMes = signal<{ estatus?: string; region?: string } | undefined>(undefined)
  private readonly paramsPend = signal<{ estatus?: string; region?: string } | undefined>({
    estatus: 'Iniciada',
  })

  private readonly tabKey = 'solicitudes_tab_index'
  readonly tabIndex = signal<number | null>(0)

  readonly mesAnio = computed(() =>
    new Date()
      .toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
      .replace(/^\w/, (c) => c.toUpperCase())
  )

  tipoAtmCtl = new FormControl<string | null>('remoto')

  private persistTabIndex = effect(() => {
    const v = this.tabIndex()
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 1) {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(this.tabKey, String(v))
      }
    }
  })
  private readonly refreshMesOnParams = effect(
    () => {
      const _ = this.paramsMes()
      const idx = this.tabIndex()
      if (this.loadedMes() && idx === 0) this.refreshMes(this.paramsMes())
    },
    { allowSignalWrites: true }
  )

  private readonly refreshPendOnParams = effect(
    () => {
      const _ = this.paramsPend()
      const idx = this.tabIndex()
      if (this.loadedPend() && idx === 1) this.refreshPend(this.paramsPend())
    },
    { allowSignalWrites: true }
  )

  private readonly loadOnTabChange = effect(
    () => {
      const idx = this.tabIndex()
      console.log('[SOLIC-LISTA][TAB-CHANGE]', idx)
      console.log('[SOLIC-LISTA][TAB-CHANGE][PEND-LOADED]', this.loadedPend())
      if (idx === 0 && !this.loadedMes()) this.loadMesActual(this.paramsMes())
      if (idx === 1 && !this.loadedPend()) this.loadPendientes(this.paramsPend())
    },
    { allowSignalWrites: true }
  )

  private readonly loadedMes = signal(false)
  private readonly loadedPend = signal(false)

  ngOnInit(): void {
    const saved =
      typeof window !== 'undefined' && typeof localStorage !== 'undefined'
        ? localStorage.getItem(this.tabKey)
        : null
    const parsed = saved === null ? 0 : Number(saved)
    this._startIndex = Number.isInteger(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0
    this.tabIndex.set(-1)
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return
    Promise.resolve().then(() => {
      this.tabIndex.set(this._startIndex)
      this.cdr.detectChanges()
      setTimeout(() => this.tabGroup?.realignInkBar())
    })
  }
  loadMesActual(params?: { estatus?: string; region?: string }) {
    this.loading.set(true)
    this.error.set(null)
    this.data
      .list(params)
      .pipe(
        map((items): ReadonlyArray<SolicitudApi> => {
          if (!Array.isArray(items)) throw new Error('Respuesta no es un arreglo')
          return items as ReadonlyArray<SolicitudApi>
        }),
        map((items): ReadonlyArray<RowLike> => this.adapt(items)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (rows) => {
          this.rowsMes.set(rows)
          this.loadedMes.set(true)
          this.loading.set(false)
        },
        error: (err) => {
          console.error('[SOLIC-LISTA][LOAD-MES-ERROR]', err)
          this.error.set('No se pudo cargar la lista del mes.')
          this.loading.set(false)
        },
      })
  }

  loadPendientes(params?: { estatus?: string; region?: string }) {
    this.loading.set(true)
    this.error.set(null)
    this.data
      .list(params)
      .pipe(
        map((items): ReadonlyArray<SolicitudApi> => {
          if (!Array.isArray(items)) throw new Error('Respuesta no es un arreglo')
          return items as ReadonlyArray<SolicitudApi>
        }),
        map((items): ReadonlyArray<RowLike> => this.adapt(items)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (rows) => {
          this.rowsPend.set(rows)
          this.loadedPend.set(true)
          this.loading.set(false)
        },
        error: (err) => {
          console.error('[SOLIC-LISTA][LOAD-PEND-ERROR]', err)
          this.error.set('No se pudo cargar la lista de pendientes.')
          this.loading.set(false)
        },
      })
  }

  refreshMes(params?: { estatus?: string; region?: string }) {
    this.data.invalidate(params)
    this.loadMesActual(params)
  }

  refreshPend(params?: { estatus?: string; region?: string }) {
    this.data.invalidate(params)
    this.loadPendientes(params)
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
      if (!this.tipoAtmCtl.valid || !this.tipoAtmCtl.value) {
        console.warn(__tryId, 'Tipo ATM inválido', this.tipoAtmCtl.value)
        this.tipoAtmCtl.markAsTouched()
        return
      }
      console.log(__tryId, 'OK -> Tipo ATM:', this.tipoAtmCtl.value)
      this.router.navigate(['/solicitudes-atm/nuevo', this.tipoAtmCtl.value])
    } catch (error) {
      console.error(__tryId, error)
    }
  }

  onIniciarActualizar(id: number): void {
    const __tryId = 'ATM_STARTER_CARD:onIniciarActualizar'
    try {
      if (!id || id <= 0) {
        console.warn(__tryId, 'ID de solicitud inválido', id)
        return
      }
      console.log(__tryId, 'OK -> ID Solicitud:', this.tipoAtmCtl.value, id)
      this.router.navigate(['/solicitudes-atm/editar', this.tipoAtmCtl.value, id])
    } catch (error) {
      console.error(__tryId, error)
    }
  }

  onPdfMes() {
    try {
      console.log('[PADRE-PDF][MES]')
    } catch (e) {
      console.error(e)
    }
  }
  onXlsxMes() {
    try {
      console.log('[PADRE-XLSX][MES]')
    } catch (e) {
      console.error(e)
    }
  }
  onFilterMes(ev: FilterEvent): void {
    try {
      console.log('[PADRE-FILTER][MES]', ev)
    } catch (err) {
      console.error('[PADRE-FILTER-ERROR][MES]', err)
    }
  }
  onPageMes(ev: PageEventLike): void {
    try {
      console.log('[PADRE-PAGE][MES]', ev)
    } catch (err) {
      console.error('[PADRE-PAGE-ERROR][MES]', err)
    }
  }
  onActionMes<R extends Row = Row>(ev: ActionEvent<R>): void {
    try {
      console.log('[PADRE-ACTION][MES]', ev.actionLabel, ev.row)
    } catch (err) {
      console.error('[PADRE-ACTION-ERROR][MES]', err)
    }
  }
  onSortMes(ev: SortEvent): void {
    try {
      console.log('[PADRE-SORT][MES]', ev)
    } catch (err) {
      console.error('[PADRE-SORT-ERROR][MES]', err)
    }
  }

  onPdfPend() {
    try {
      console.log('[PADRE-PDF][PEND]')
    } catch (e) {
      console.error(e)
    }
  }
  onXlsxPend() {
    try {
      console.log('[PADRE-XLSX][PEND]')
    } catch (e) {
      console.error(e)
    }
  }
  onFilterPend(ev: FilterEvent): void {
    try {
      console.log('[PADRE-FILTER][PEND]', ev)
    } catch (err) {
      console.error('[PADRE-FILTER-ERROR][PEND]', err)
    }
  }
  onPagePend(ev: PageEventLike): void {
    try {
      console.log('[PADRE-PAGE][PEND]', ev)
    } catch (err) {
      console.error('[PADRE-PAGE-ERROR][PEND]', err)
    }
  }
  onActionPend<R extends Row = Row>(ev: ActionEvent<R>): void {
    try {
      console.log('[PADRE-ACTION][PEND]', ev.actionLabel, ev.row)
    } catch (err) {
      console.error('[PADRE-ACTION-ERROR][PEND]', err)
    }
  }
  onSortPend(ev: SortEvent): void {
    try {
      console.log('[PADRE-SORT][PEND]', ev)
    } catch (err) {
      console.error('[PADRE-SORT-ERROR][PEND]', err)
    }
  }
}
