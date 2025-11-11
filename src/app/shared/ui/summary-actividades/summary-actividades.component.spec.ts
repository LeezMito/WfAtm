import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryActividadesComponent } from './summary-actividades.component';

describe('SummaryActividadesComponent', () => {
  let component: SummaryActividadesComponent;
  let fixture: ComponentFixture<SummaryActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryActividadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SummaryActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
