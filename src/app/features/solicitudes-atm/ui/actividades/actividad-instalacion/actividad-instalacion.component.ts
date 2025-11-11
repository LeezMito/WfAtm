import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Output, signal } from '@angular/core'
import { FieldConfig } from '../../../../../shared/interfaces/dynamic-form.interface'
import { DynamicFormComponent } from '../../../../../shared/ui/dynamic-form/dynamic-form.component'
import { TemplateActividadComponent } from '../../../../../shared/ui/template-actividad/template-actividad.component'

export const RESPONSABLE_OPTS = [
  { value: 'instalacionAtms', label: 'Instalación ATM´s' },
  { value: 'negocioAtms', label: 'Negocio ATM’s' },
  { value: 'banca', label: 'Banca' },
  { value: 'nomina', label: 'Nómina' },
  { value: 'cliente', label: 'Cliente' },
] as const

export const ESTATUS_OPTS = [
  { value: 'medioEnlace', label: 'Medio de enlace' },
  { value: 'adecuaciones', label: 'Adecuaciones' },
  { value: 'accesos', label: 'Accesos' },
  { value: 'comodato', label: 'Comodato' },
  { value: 'definicionSitio', label: 'Definición del sitio' },
  { value: 'liberacionSitio', label: 'Liberación del sitio' },
] as const

@Component({
  selector: 'app-actividad-instalacion',
  standalone: true,
  imports: [CommonModule, TemplateActividadComponent, DynamicFormComponent],
  templateUrl: './actividad-instalacion.component.html',
  styleUrl: './actividad-instalacion.component.sass',
})
export class ActividadInstalacionComponent {
  iniciaFecha = '2024-01-15'

  private readonly camposResponsableEstatus: ReadonlyArray<FieldConfig> = [
    {
      key: 'responsable',
      tipo: 'select',
      label: 'Responsable',
      isRequired: true,
      options: RESPONSABLE_OPTS,
    },
    {
      key: 'estatus',
      tipo: 'select',
      label: 'Estatus',
      isRequired: true,
      options: ESTATUS_OPTS,
    },
    {
      key: 'costoExcedenteAdecuaciones',
      tipo: 'input',
      label: 'Costo excedente de adecuaciones',
      placeholder: '0',
      minValue: 0,
      maxValue: 999999999,
    },
    {
      key: 'observaciones',
      tipo: 'textarea',
      label: 'Observaciones',
      placeholder: 'Notas adicionales',
      maxLength: 500,
    },
  ]

  private readonly camposComodato: ReadonlyArray<FieldConfig> = [
    {
      key: 'contratoComodato',
      tipo: 'file',
      label: 'Carga de Contrato de comodato',
      fileExt: ['pdf'],
      isRequired: true,
    },
    {
      key: 'observacion',
      tipo: 'textarea',
      label: 'Observación',
      placeholder: 'SE SUBE COMODATO',
      maxLength: 500,
    },
  ]

  private readonly camposVoBoObservacion: ReadonlyArray<FieldConfig> = [
    {
      key: 'otorgarVoBo',
      tipo: 'checkbox',
      label: 'Otorgar Vo.Bo.',
      value: false,
    },
    {
      key: 'observacion',
      tipo: 'textarea',
      label: 'Observación',
      placeholder:
        'Adelante, se agrega al contrato matriz de Soriana, se solicita el traspaso del presupuesto',
      maxLength: 500,
    },
  ]

  camposActividades = signal(this.camposResponsableEstatus)
  camposInstalacionOperaciones = signal(this.camposComodato)
  camposInstalacionActividades = signal(this.camposVoBoObservacion)

  private readonly NUM_FORMS = 3

  @Output() updAvance = new EventEmitter<number>()

  onGuardar(e: { values: Record<string, unknown>; files: Record<string, File | null> }): void {
    console.log('[PADRE:GUARDAR] values =>', e.values)
    console.log('[PADRE:GUARDAR] files  =>', e.files)
    this.updAvance.emit(100 / this.NUM_FORMS)
  }
}
