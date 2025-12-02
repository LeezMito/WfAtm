import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs'
import { Router } from '@angular/router'
import { map } from 'rxjs/operators'
import { ButtonStyleDirective } from '../../../../shared/directives/button/button-style.directive'
import { RowLike, TableColumn } from '../../../../shared/interfaces/table-smart.interface'
import { LoggerService } from '../../../../shared/services/logger-service'
import { TableSmartComponent } from '../../../../shared/ui/table-smart/table-smart.component'
import { SolicitudApi } from '../../interfaces/servicio-prueba-api.interface'
import { SolicitudesDataService } from '../../services/solicitudes-data.service'

type Row = Record<string, unknown>
type FilterEvent = { columns: string[]; query: string }
type ActionEvent<R extends Row = Row> = { actionLabel: string; row: R }

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudListaPageComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router)
  private readonly data = inject(SolicitudesDataService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly logger = inject(LoggerService)

  readonly loading = signal<boolean>(false)
  readonly error = signal<string | null>(null)

  @ViewChild(MatTabGroup) tabGroup?: MatTabGroup

  private _startIndex = 0

  readonly disableTabAnimation = computed(() => this.tabIndex() === 1)

  readonly columns: ReadonlyArray<TableColumn> = [
    {
      key: 'noSolicitud',
      title: 'No. Solicitud',
      sorted: true,
      includeInFilter: true,
      icon: 'visibility',
      haveAction: true,
      buttonAppearance: 'outline',
      buttonType: 'secondary',
    },
    {
      key: 'fechaCreacion',
      title: 'Fecha de Creación',
      sorted: true,
      includeInFilter: false,
      pipe: 'date',
    },
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

  private readonly persistTabIndex = effect(() => {
    const v = this.tabIndex()
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0) {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(this.tabKey, String(v))
        } catch (e) {
          this.logger.warn('PERSIST TAB INDEX FAILED', { ctx: 'SolicitudLista', data: String(e) })
        }
      }
    }
  })

  private readonly refreshMesOnParams = effect(
    () => {
      const idx = this.tabIndex()
      if (this.loadedMes() && idx === 0) this.refreshMes(this.paramsMes())
    },
    { allowSignalWrites: true }
  )

  private readonly refreshPendOnParams = effect(
    () => {
      const idx = this.tabIndex()
      if (this.loadedPend() && idx === 1) this.refreshPend(this.paramsPend())
    },
    { allowSignalWrites: true }
  )

  private readonly loadOnTabChange = effect(
    () => {
      const idx = this.tabIndex()
      this.logger.debug('TAB-CHANGE', {
        ctx: 'SolicitudLista',
        data: { idx, loadedPend: this.loadedPend() },
      })
      if (idx === 0 && !this.loadedMes()) this.loadMesActual(this.paramsMes())
      if (idx === 1 && !this.loadedPend()) this.loadPendientes(this.paramsPend())
    },
    { allowSignalWrites: true }
  )

  private readonly loadedMes = signal(false)
  private readonly loadedPend = signal(false)

  ngOnInit(): void {
    let parsed: number | null = null
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.tabKey)
        parsed = saved === null ? null : Number.parseInt(saved, 10)
      } catch (e) {
        this.logger.warn('READ TAB INDEX FAILED', { ctx: 'SolicitudLista', data: String(e) })
        parsed = null
      }
    }

    this._startIndex = Number.isFinite(parsed) && parsed !== null ? (parsed as number) : 0
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
          this.logger.error('LOAD-MES-ERROR', { ctx: 'SolicitudLista', data: err })
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
          this.logger.error('LOAD-PEND-ERROR', { ctx: 'SolicitudLista', data: err })
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
    const ctx = 'ATM_STARTER_CARD:onIniciarSolicitud'
    try {
      if (!this.tipoAtmCtl.valid || !this.tipoAtmCtl.value) {
        this.logger.warn('Tipo ATM inválido', { ctx, data: { value: this.tipoAtmCtl.value } })
        this.tipoAtmCtl.markAsTouched()
        return
      }
      this.logger.info('OK -> Tipo ATM', { ctx, data: { tipoAtm: this.tipoAtmCtl.value } })
      this.router.navigate(['/solicitudes-atm/nuevo', this.tipoAtmCtl.value])
    } catch (error) {
      this.logger.error('EXCEPTION', { ctx, data: error })
    }
  }

  onIniciarActualizar(id: number): void {
    const ctx = 'ATM_STARTER_CARD:onIniciarActualizar'
    try {
      if (!id || id <= 0) {
        this.logger.warn('ID de solicitud inválido', { ctx, data: { id } })
        return
      }
      this.logger.info('OK -> ID Solicitud', { ctx, data: { tipoAtm: this.tipoAtmCtl.value, id } })
      this.router.navigate(['/solicitudes-atm/editar', this.tipoAtmCtl.value, id])
    } catch (error) {
      this.logger.error('EXCEPTION', { ctx, data: error })
    }
  }

  onPdfMes() {
    try {
      this.logger.debug('PDF MES', { ctx: 'SolicitudLista' })
    } catch (e) {
      this.logger.error('PDF MES ERROR', { ctx: 'SolicitudLista', data: e })
    }
  }

  onXlsxMes() {
    try {
      this.logger.debug('XLSX MES', { ctx: 'SolicitudLista' })
    } catch (e) {
      this.logger.error('XLSX MES ERROR', { ctx: 'SolicitudLista', data: e })
    }
  }

  onFilterMes(ev: FilterEvent): void {
    try {
      this.logger.debug('FILTER MES', { ctx: 'SolicitudLista', data: ev })
    } catch (err) {
      this.logger.error('FILTER MES ERROR', { ctx: 'SolicitudLista', data: err })
    }
  }

  onActionMes<R extends Row = Row>(ev: ActionEvent<R>): void {
    try {
      this.logger.debug('ACTION MES', {
        ctx: 'SolicitudLista',
        data: { action: ev.actionLabel, row: ev.row },
      })
    } catch (err) {
      this.logger.error('ACTION MES ERROR', { ctx: 'SolicitudLista', data: err })
    }
  }

  onPdfPend() {
    try {
      this.logger.debug('PDF PEND', { ctx: 'SolicitudLista' })
    } catch (e) {
      this.logger.error('PDF PEND ERROR', { ctx: 'SolicitudLista', data: e })
    }
  }
  onXlsxPend() {
    try {
      this.logger.debug('XLSX PEND', { ctx: 'SolicitudLista' })
    } catch (e) {
      this.logger.error('XLSX PEND ERROR', { ctx: 'SolicitudLista', data: e })
    }
  }
  onFilterPend(ev: FilterEvent): void {
    try {
      this.logger.debug('FILTER PEND', { ctx: 'SolicitudLista', data: ev })
    } catch (err) {
      this.logger.error('FILTER PEND ERROR', { ctx: 'SolicitudLista', data: err })
    }
  }

  onActionPend<R extends Row = Row>(ev: ActionEvent<R>): void {
    try {
      this.logger.debug('ACTION PEND', {
        ctx: 'SolicitudLista',
        data: { action: ev.actionLabel, row: ev.row },
      })
    } catch (err) {
      this.logger.error('ACTION PEND ERROR', { ctx: 'SolicitudLista', data: err })
    }
  }
}
