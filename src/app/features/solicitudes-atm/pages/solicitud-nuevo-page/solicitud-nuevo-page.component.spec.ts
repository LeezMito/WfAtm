import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudNuevoPageComponent } from './solicitud-nuevo-page.component';

describe('SolicitudNuevoPageComponent', () => {
  let component: SolicitudNuevoPageComponent;
  let fixture: ComponentFixture<SolicitudNuevoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudNuevoPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudNuevoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
