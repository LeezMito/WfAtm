import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Output, signal } from '@angular/core'
import { FieldConfig } from '../../../../../shared/interfaces/dynamic-form.interface'
import { DynamicFormComponent } from '../../../../../shared/ui/dynamic-form/dynamic-form.component'
import { TemplateActividadComponent } from '../../../../../shared/ui/template-actividad/template-actividad.component'

@Component({
  selector: 'app-actividad-validacion-negocio',
  standalone: true,
  imports: [CommonModule, TemplateActividadComponent, DynamicFormComponent],
  templateUrl: './actividad-validacion-negocio.component.html',
  styleUrl: './actividad-validacion-negocio.component.sass',
})
export class ActividadValidacionNegocioComponent {
  iniciaFecha = '2024-01-15'

  private readonly camposVoBoCedula: ReadonlyArray<FieldConfig> = [
    {
      key: 'otorgarVoBo',
      tipo: 'checkbox',
      label: 'Otorgar Vo.Bo.',
      value: false,
      isRequired: false,
    },
    {
      key: 'cedulaActualizada',
      tipo: 'file',
      label: 'Carga de Cédula actualizada',
      fileExt: ['xls', 'xlsx'],
    },
  ]

  camposValida = signal(this.camposVoBoCedula)

  private readonly NUM_FORMS = 1

  @Output() updAvance = new EventEmitter<number>()

  onGuardar(e: { values: Record<string, unknown>; files: Record<string, File | null> }): void {
    console.log('[PADRE:GUARDAR] values =>', e.values)
    console.log('[PADRE:GUARDAR] files  =>', e.files)
    this.updAvance.emit(100 / this.NUM_FORMS)
  }
}
