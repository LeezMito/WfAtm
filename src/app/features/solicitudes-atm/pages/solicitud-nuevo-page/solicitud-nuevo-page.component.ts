import { Component, inject, signal, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { SolicitudSection } from '../../../../shared/interfaces/summary-actividades.interface'
import { LoggerService } from '../../../../shared/services/logger-service'
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
  private readonly route = inject(ActivatedRoute)
  private readonly logger = inject(LoggerService)

  readonly tipoAtm = signal<string>('')

  @ViewChild(StepActividadesComponent) stepper!: StepActividadesComponent

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
      this.logger.error('Parámetro tipoAtm ausente', { ctx: 'SolicitudNuevoPage' })
      throw new Error('El parámetro tipoAtm es requerido')
    }
    this.logger.info('Tipo ATM recibido', { ctx: 'SolicitudNuevoPage', data: { tipoAtm } })
    this.tipoAtm.set(tipoAtm)
  }
}
