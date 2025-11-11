import { CommonModule } from '@angular/common'
import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core'
import { FieldConfig } from '../../../../../shared/interfaces/dynamic-form.interface'
import { DynamicFormComponent } from '../../../../../shared/ui/dynamic-form/dynamic-form.component'
import { TemplateActividadComponent } from '../../../../../shared/ui/template-actividad/template-actividad.component'

@Component({
  selector: 'app-actividad-validacion-visita',
  standalone: true,
  imports: [CommonModule, TemplateActividadComponent, DynamicFormComponent],
  templateUrl: './actividad-validacion-visita.component.html',
  styleUrl: './actividad-validacion-visita.component.sass',
})
export class ActividadValidacionVisitaComponent implements OnInit {
  iniciaFecha = '2024-01-15'

  private readonly camposSeguridadSitio: ReadonlyArray<FieldConfig> = [
    {
      key: 'voBoSitio',
      tipo: 'select',
      label: 'Vo. Bo. Sitio',
      isRequired: true,
      options: [
        { value: 'aprobado', label: 'Aprobado' },
        { value: 'rechazado', label: 'Rechazado' },
        { value: 'pendiente', label: 'Pendiente' },
      ],
    },
    {
      key: 'escenarioSeguridad',
      tipo: 'select',
      label: 'Escenario de Seguridad',
      isRequired: true,
      options: [
        { value: 'bajo', label: 'Bajo' },
        { value: 'medio', label: 'Medio' },
        { value: 'alto', label: 'Alto' },
      ],
    },
    {
      key: 'caseta',
      tipo: 'checkbox',
      label: 'Caseta',
    },
    {
      key: 'cinturonSeguridad',
      tipo: 'checkbox',
      label: 'Cinturón de seguridad',
    },
    {
      key: 'recomendaciones',
      tipo: 'textarea',
      label: 'Recomendaciones',
      placeholder: 'Escribe tus observaciones o sugerencias',
      maxLength: 500,
    },
  ]

  camposValida = signal(this.camposSeguridadSitio)

  private readonly NUM_FORMS = 1

  @Output() updAvance = new EventEmitter<number>()

  ngOnInit(): void {
    console.log('Actividad Validación Visita iniciada')
  }

  onGuardar(e: { values: Record<string, unknown>; files: Record<string, File | null> }): void {
    console.log('[PADRE:GUARDAR] values =>', e.values)
    console.log('[PADRE:GUARDAR] files  =>', e.files)
    this.updAvance.emit(100 / this.NUM_FORMS)
  }
}
