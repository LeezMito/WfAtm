import { Component, inject, signal, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { SummaryActividadesComponent } from '../../../../shared/ui/summary-actividades/summary-actividades.component'
import { StepActividadesComponent } from '../../ui/step-actividades/step-actividades.component'

@Component({
  selector: 'app-solicitud-editar-page',
  standalone: true,
  imports: [StepActividadesComponent, SummaryActividadesComponent],
  templateUrl: './solicitud-editar-page.component.html',
  styleUrl: './solicitud-editar-page.component.sass',
})
export class SolicitudEditarPageComponent {
  route = inject(ActivatedRoute)
  tipoAtm = signal<string>('')
  idSolicitud = signal<string>('')

  constructor() {
    const tipoAtm = this.route.snapshot.paramMap.get('tipoAtm')
    if (!tipoAtm) {
      throw new Error('El parámetro tipoAtm es requerido')
    }
    console.log('Tipo ATM:', tipoAtm)
    this.tipoAtm.set(tipoAtm)
    const solicitud = Number(this.route.snapshot.paramMap.get('idSolicitud'))
    if (!solicitud) {
      throw new Error('El parámetro idSolicitud es requerido')
    }
    this.idSolicitud.set(String(solicitud))
  }
  @ViewChild(StepActividadesComponent) stepper!: StepActividadesComponent
}
