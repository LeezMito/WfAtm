import { Component, inject, signal, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { SummaryActividadesComponent } from '../../../../shared/ui/summary-actividades/summary-actividades.component'
import { StepActividadesComponent } from '../../ui/step-actividades/step-actividades.component'

@Component({
  selector: 'app-solicitud-nuevo-page',
  standalone: true,
  imports: [StepActividadesComponent, SummaryActividadesComponent],
  templateUrl: './solicitud-nuevo-page.component.html',
  styleUrl: './solicitud-nuevo-page.component.sass',
})
export class SolicitudNuevoPageComponent {
  route = inject(ActivatedRoute)
  tipoAtm = signal<string>('')

  constructor() {
    const tipoAtm = this.route.snapshot.paramMap.get('tipoAtm')
    if (!tipoAtm) {
      throw new Error('El parámetro tipoAtm es requerido')
    }
    console.log('Tipo ATM:', tipoAtm)
    this.tipoAtm.set(tipoAtm)
  }
  @ViewChild(StepActividadesComponent) stepper!: StepActividadesComponent
}
