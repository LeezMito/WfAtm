import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { Router } from '@angular/router'
import { of } from 'rxjs'
import { LoggerService } from '../../../../shared/services/logger-service'
import { SolicitudApi } from '../../interfaces/servicio-prueba-api.interface'
import { SolicitudesDataService } from '../../services/solicitudes-data.service'
import { SolicitudListaPageComponent } from './solicitud-lista-page.component'

class RouterMock {
  navigate = jasmine.createSpy('navigate')
}

class SolicitudesDataServiceMock {
  list = jasmine.createSpy('list').and.returnValue(of<ReadonlyArray<SolicitudApi>>([]))
  invalidate = jasmine.createSpy('invalidate')
}

class LoggerServiceMock {
  debug = jasmine.createSpy('debug')
  info = jasmine.createSpy('info')
  warn = jasmine.createSpy('warn')
  error = jasmine.createSpy('error')
}

describe('SolicitudListaPageComponent', () => {
  let fixture: ComponentFixture<SolicitudListaPageComponent>
  let component: SolicitudListaPageComponent
  let router: RouterMock
  let data: SolicitudesDataServiceMock

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudListaPageComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useClass: RouterMock },
        { provide: SolicitudesDataService, useClass: SolicitudesDataServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SolicitudListaPageComponent)
    component = fixture.componentInstance
    router = TestBed.inject(Router) as unknown as RouterMock
    data = TestBed.inject(SolicitudesDataService) as unknown as SolicitudesDataServiceMock
  })

  it('Debe crear el componente', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('lee y aplica el índice de pestaña guardado', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('1')
    component.ngOnInit()
    component.ngAfterViewInit()
    flush()
    tick()
    expect(component.tabIndex()).toBe(1)
  }))

  // it('persiste el índice de pestaña en localStorage', fakeAsync(() => {
  //   // Garantiza que _startIndex sea 0
  //   spyOn(localStorage, 'getItem').and.returnValue(null)

  //   const setSpy = spyOn(localStorage, 'setItem').and.stub()

  //   // Corre el ciclo de vida completo
  //   component.ngOnInit()
  //   component.ngAfterViewInit()

  //   // Resuelve Promise.resolve() y el setTimeout
  //   flush()
  //   tick()

  //   // AfterViewInit aplica this._startIndex (0) → effect persiste
  //   expect(setSpy).toHaveBeenCalledWith('solicitudes_tab_index', '0')
  // }))

  // it('navega al iniciar solicitud con tipo ATM válido', () => {
  //   fixture.detectChanges()
  //   component.tipoAtmCtl.setValue('remoto')
  //   component.onIniciarSolicitud()
  //   expect(router.navigate).toHaveBeenCalledWith(['/solicitudes-atm/nuevo', 'remoto'])
  // })

  // it('no navega y marca touched cuando tipo ATM inválido', () => {
  //   fixture.detectChanges()
  //   component.tipoAtmCtl.setValue(null)
  //   const touchedSpy = spyOn(component.tipoAtmCtl, 'markAsTouched').and.callThrough()
  //   component.onIniciarSolicitud()
  //   expect(router.navigate).not.toHaveBeenCalled()
  //   expect(touchedSpy).toHaveBeenCalled()
  // })

  // it('navega al editar con id válido', () => {
  //   fixture.detectChanges()
  //   component.tipoAtmCtl.setValue('empresarial')
  //   component.onIniciarActualizar(10)
  //   expect(router.navigate).toHaveBeenCalledWith(['/solicitudes-atm/editar', 'empresarial', 10])
  // })

  // it('consume el servicio y llena rowsMes', () => {
  //   const mockData: ReadonlyArray<SolicitudApi> = [
  //     { avanceSolicitud: 0.5 } as SolicitudApi,
  //     { avanceSolicitud: 0.9 } as SolicitudApi,
  //   ]
  //   data.list.and.returnValue(of(mockData))
  //   component.loadMesActual()
  //   type AdaptedRow = RowLike & { ['avanceSolicitudPct']: string }
  //   const rows = component.rowsMes() as ReadonlyArray<AdaptedRow>
  //   expect(rows.length).toBe(2)
  //   expect(rows[0]['avanceSolicitudPct']).toBeDefined()
  //   expect(rows[0]['avanceSolicitudPct']).toContain('%')
  // })

  // it('maneja error en loadMesActual', () => {
  //   data.list.and.returnValue(throwError(() => new Error('Fallo')))
  //   component.loadMesActual()
  //   expect(component.error()).toBe('No se pudo cargar la lista del mes.')
  // })

  // it('handlers de tabla (MES y PEND) no lanzan errores', () => {
  //   const filterEvent = { columns: ['col'], query: 'test' }
  //   const pageEvent = { pageIndex: 0, pageSize: 10 }
  //   const sortEvent = { active: 'col', direction: 'asc' as const }
  //   const actionEvent = { actionLabel: 'ver', row: { id: 1 } }

  //   expect(() => component.onFilterMes(filterEvent)).not.toThrow()
  //   expect(() => component.onPageMes(pageEvent)).not.toThrow()
  //   expect(() => component.onSortMes(sortEvent)).not.toThrow()
  //   expect(() => component.onActionMes(actionEvent)).not.toThrow()

  //   expect(() => component.onFilterPend(filterEvent)).not.toThrow()
  //   expect(() => component.onPagePend(pageEvent)).not.toThrow()
  //   expect(() => component.onSortPend(sortEvent)).not.toThrow()
  //   expect(() => component.onActionPend(actionEvent)).not.toThrow()
  // })

  // it('loadOnTabChange: al aplicar AfterViewInit con índice 0 carga Mes y luego refresca una sola vez', fakeAsync(() => {
  //   spyOn(localStorage, 'getItem').and.returnValue('0')

  //   const listSpy = data.list.and.returnValue(of<ReadonlyArray<SolicitudApi>>([]))
  //   const invalidateSpy = data.invalidate

  //   component.ngOnInit()
  //   component.ngAfterViewInit()
  //   flush()
  //   tick()

  //   // 1) loadMesActual por loadOnTabChange
  //   // 2) refreshMes por refreshMesOnParams tras loadedMes=true
  //   expect(listSpy.calls.count()).toBe(2)
  //   expect(invalidateSpy).toHaveBeenCalledTimes(1)

  //   // Re-seleccionar misma pestaña NO debe provocar una 3a llamada
  //   component.tabIndex.set(0)
  //   flush()
  //   tick()

  //   expect(listSpy.calls.count()).toBe(2)
  //   expect(invalidateSpy).toHaveBeenCalledTimes(1)
  // }))

  // it('loadOnTabChange: si la pestaña es 1 y no está cargado, llama loadPendientes y luego refresh una sola vez', fakeAsync(() => {
  //   spyOn(localStorage, 'getItem').and.returnValue('1')

  //   const listSpy = data.list.and.returnValue(of<ReadonlyArray<SolicitudApi>>([]))
  //   const invalidateSpy = data.invalidate

  //   component.ngOnInit()
  //   component.ngAfterViewInit()
  //   flush()
  //   tick()

  //   // 1) loadPendientes por loadOnTabChange
  //   // 2) refreshPend por refreshPendOnParams tras loadedPend=true
  //   expect(listSpy.calls.count()).toBe(2)
  //   expect(invalidateSpy).toHaveBeenCalledTimes(1)

  //   // Re-seleccionar la pestaña 1 NO debe disparar una tercera llamada
  //   component.tabIndex.set(1)
  //   flush()
  //   tick()

  //   expect(listSpy.calls.count()).toBe(2)
  //   expect(invalidateSpy).toHaveBeenCalledTimes(1)
  // }))

  // it('refreshMes: invalida caché y vuelve a cargar con parámetros', () => {
  //   const params = { estatus: 'Activa', region: 'Norte' } as const
  //   data.list.and.returnValue(of<ReadonlyArray<SolicitudApi>>([]))

  //   component.refreshMes(params)

  //   expect(data.invalidate).toHaveBeenCalledWith(params)
  //   expect(data.list).toHaveBeenCalledWith(params)
  // })

  // it('refreshPend: invalida caché y vuelve a cargar con parámetros', () => {
  //   const params = { estatus: 'Suspendida', region: 'Sur' } as const
  //   data.list.and.returnValue(of<ReadonlyArray<SolicitudApi>>([]))

  //   component.refreshPend(params)

  //   expect(data.invalidate).toHaveBeenCalledWith(params)
  //   expect(data.list).toHaveBeenCalledWith(params)
  // })

  // it('persistencia: si localStorage.setItem falla, registra warn y no rompe', fakeAsync(() => {
  //   // AfterViewInit aplicará _startIndex = 0 (cambio desde -1)
  //   spyOn(localStorage, 'getItem').and.returnValue('0')

  //   const setSpy = spyOn(localStorage, 'setItem').and.callFake(() => {
  //     throw new Error('quota')
  //   })
  //   const logger = TestBed.inject(LoggerService) as unknown as LoggerServiceMock

  //   component.ngOnInit()
  //   component.ngAfterViewInit()

  //   // Resuelve Promise.resolve() y el setTimeout del componente
  //   flush()
  //   tick()

  //   // El effect debió intentar persistir y fallar → logger.warn
  //   expect(setSpy).toHaveBeenCalledWith('solicitudes_tab_index', '0')
  //   expect(logger.warn).toHaveBeenCalled()

  //   // El componente sigue en estado consistente
  //   expect(component.tabIndex()).toBe(0)

  //   // (por si tu entorno necesita un cambio explícito para re-disparar el effect:)
  //   // component.tabIndex.set(1); flush(); tick();
  //   // expect(setSpy).toHaveBeenCalledWith('solicitudes_tab_index', '1')
  // }))

  // it('lectura de índice: si localStorage.getItem lanza, registra warn y aplica índice 0 por defecto', fakeAsync(() => {
  //   spyOn(localStorage, 'getItem').and.callFake(() => {
  //     throw new Error('blocked')
  //   })
  //   const logger = TestBed.inject(LoggerService) as unknown as LoggerServiceMock

  //   component.ngOnInit()
  //   component.ngAfterViewInit()
  //   flush()
  //   tick()

  //   expect(logger.warn).toHaveBeenCalled()
  //   expect(component.tabIndex()).toBe(0)
  // }))

  // it('loadPendientes: consume el servicio y llena rowsPend', () => {
  //   const mockData: ReadonlyArray<SolicitudApi> = [
  //     { avanceSolicitud: 0.25 } as SolicitudApi,
  //     { avanceSolicitud: 0.75 } as SolicitudApi,
  //   ]
  //   data.list.and.returnValue(of(mockData))

  //   component.loadPendientes()

  //   const rowsPend = component.rowsPend()
  //   expect(Array.isArray(rowsPend)).toBeTrue()
  //   expect(rowsPend.length).toBe(2)
  // })

  // it('loadPendientes: maneja error y setea mensaje en error signal', () => {
  //   data.list.and.returnValue(throwError(() => new Error('boom pend')))
  //   component.loadPendientes()
  //   expect(component.error()).toBe('No se pudo cargar la lista de pendientes.')
  // })

  // it('NO recarga pendientes si loadedPend ya es true y el tab sigue en 1 (loadOnTabChange)', fakeAsync(() => {
  //   // Forzamos que AfterViewInit seleccione la pestaña 1 (Pendientes)
  //   spyOn(localStorage, 'getItem').and.returnValue('1')

  //   const listSpy = data.list.and.returnValue(of<ReadonlyArray<SolicitudApi>>([]))

  //   component.ngOnInit()
  //   component.ngAfterViewInit()

  //   // Resuelve microtareas (Promise.resolve) + timers (setTimeout)
  //   flush()
  //   tick()

  //   // Con el código actual: 1) loadPendientes -> 2) refreshPend tras loadedPend=true
  //   expect(listSpy.calls.count()).toBe(2)

  //   // Si volvemos a “seleccionar” la pestaña 1, NO debe disparar una TERCERA carga
  //   component.tabIndex.set(1)
  //   flush()
  //   tick()

  //   expect(listSpy.calls.count()).toBe(2)
  // }))

  // it('refreshPend: invalida caché y recarga con parámetros', () => {
  //   const params = { estatus: 'Iniciada', region: 'Centro' } as const
  //   data.list.and.returnValue(of<ReadonlyArray<SolicitudApi>>([]))

  //   component.refreshPend(params)

  //   expect(data.invalidate).toHaveBeenCalledWith(params)
  //   expect(data.list).toHaveBeenCalledWith(params)
  // })
})
