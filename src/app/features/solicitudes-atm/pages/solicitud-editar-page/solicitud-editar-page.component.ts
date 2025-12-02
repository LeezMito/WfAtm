import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { SolicitudSection } from '../../../../shared/interfaces/summary-actividades.interface'
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

  section = signal<SolicitudSection>({
    titulo: 'Solicitud 20250421.3811',
    nombreSitio: 'EJEMPLO DDP WF',
    region: 'Metro Norte',
    responsable: 'Sin Responsable',

    fechaInicio: '21/Abr/2025',
    fechaObjetivo: '08/Ago/2025',
    diasTranscurridos: 12,

    avance: 21,

    coberturaServicio: 'ATMs',

    responsableInstalacion: '',
    costoTraslado: '0.00',
    medioEnlace: 'MLS',
    proveedor: '',

    escenarioSeguridad: '',
    caseta: 'Cimbraron',
    montoSeguridad: '',
  })

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
}
