import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateActividadComponent } from './template-actividad.component';

describe('TemplateActividadComponent', () => {
  let component: TemplateActividadComponent;
  let fixture: ComponentFixture<TemplateActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateActividadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
