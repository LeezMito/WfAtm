import { Component, effect, input, Signal } from '@angular/core'
import { SolicitudSection } from '../../interfaces/summary-actividades.interface'

@Component({
  selector: 'app-summary-actividades',
  standalone: true,
  imports: [],
  templateUrl: './summary-actividades.component.html',
  styleUrl: './summary-actividades.component.sass',
})
export class SummaryActividadesComponent {
  sectionData = input.required<SolicitudSection>()

  data: Signal<SolicitudSection> = this.sectionData

  constructor() {
    effect(() => {
      console.log('Sección recibida →', this.data())
    })
  }
}
