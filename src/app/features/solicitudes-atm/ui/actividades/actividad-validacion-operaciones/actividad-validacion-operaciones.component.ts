import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Output, signal } from '@angular/core'
import { FieldConfig } from '../../../../../shared/interfaces/dynamic-form.interface'
import { DynamicFormComponent } from '../../../../../shared/ui/dynamic-form/dynamic-form.component'
import { TemplateActividadComponent } from '../../../../../shared/ui/template-actividad/template-actividad.component'

@Component({
  selector: 'app-actividad-validacion-operaciones',
  standalone: true,
  imports: [CommonModule, TemplateActividadComponent, DynamicFormComponent],
  templateUrl: './actividad-validacion-operaciones.component.html',
  styleUrl: './actividad-validacion-operaciones.component.sass',
})
export class ActividadValidacionOperacionesComponent {
  iniciaFecha = '2024-01-15'

  private readonly camposValidaOperaciones: ReadonlyArray<FieldConfig> = [
    {
      key: 'medioEnlace',
      tipo: 'select',
      label: 'Medio de Enlace',
      isRequired: true,
      options: [
        { value: 'mpls', label: 'MPLS' },
        { value: 'fibra', label: 'Fibra óptica' },
        { value: 'microondas', label: 'Microondas' },
        { value: 'internetDedicado', label: 'Internet dedicado' },
        { value: 'lte4g', label: '4G/LTE' },
        { value: 'otro', label: 'Otro' },
      ],
    },
    {
      key: 'medioEnlaceOtro',
      tipo: 'input',
      label: 'Otro',
      placeholder: 'Especifica el medio de enlace',
      maxLength: 80,
    },
    {
      key: 'montoSeguridad',
      tipo: 'input',
      label: 'Monto a considerar por recomendaciones específicas de seguridad',
      placeholder: '0',
      minValue: 0,
      maxValue: 999999999,
    },
    {
      key: 'observacion',
      tipo: 'textarea',
      label: 'Observación',
      placeholder: 'Se confirman facilidades de MPLS no requiere proyecto',
      maxLength: 500,
    },
  ]

  camposValida = signal(this.camposValidaOperaciones)

  private readonly NUM_FORMS = 1

  @Output() updAvance = new EventEmitter<number>()

  onGuardar(e: { values: Record<string, unknown>; files: Record<string, File | null> }): void {
    console.log('[PADRE:GUARDAR] values =>', e.values)
    console.log('[PADRE:GUARDAR] files  =>', e.files)
    this.updAvance.emit(100 / this.NUM_FORMS)
  }
}
