import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudListaPageComponent } from './solicitud-lista-page.component';

describe('SolicitudListaPageComponent', () => {
  let component: SolicitudListaPageComponent;
  let fixture: ComponentFixture<SolicitudListaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudListaPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudListaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
