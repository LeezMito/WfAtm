import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadCargaSolicitudComponent } from './actividad-carga-solicitud.component';

describe('ActividadCargaSolicitudComponent', () => {
  let component: ActividadCargaSolicitudComponent;
  let fixture: ComponentFixture<ActividadCargaSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadCargaSolicitudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActividadCargaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
