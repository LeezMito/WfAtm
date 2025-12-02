import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute, convertToParamMap } from '@angular/router'
import { SolicitudNuevoPageComponent } from './solicitud-nuevo-page.component'

describe('SolicitudNuevoPageComponent', () => {
  let fixture: ComponentFixture<SolicitudNuevoPageComponent>
  let component: SolicitudNuevoPageComponent

  const activatedRouteOK = {
    snapshot: { paramMap: convertToParamMap({ tipoAtm: 'remoto' }) },
  } as Partial<ActivatedRoute>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudNuevoPageComponent, NoopAnimationsModule], // standalone + anims off
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteOK }],
    }).compileComponents()

    fixture = TestBed.createComponent(SolicitudNuevoPageComponent)
    component = fixture.componentInstance
  })

  it('should create (con tipoAtm en la ruta)', () => {
    // dispara ngOnInit y render
    fixture.detectChanges()
    expect(component).toBeTruthy()
    // opcional: verifica que el signal se cargó
    expect(component['tipoAtm']()).toBe('remoto')
  })

  it('lanza error si falta tipoAtm en la ruta', async () => {
    // reconfigura el provider con param faltante
    TestBed.resetTestingModule()
    await TestBed.configureTestingModule({
      imports: [SolicitudNuevoPageComponent, NoopAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } },
        },
      ],
    }).compileComponents()

    // crear componente debe lanzar por el throw del ctor
    expect(() => TestBed.createComponent(SolicitudNuevoPageComponent)).toThrowError(
      /tipoAtm es requerido/i
    )
  })
})
