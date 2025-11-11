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
  selector: 'app-actividad-alta-atm',
  standalone: true,
  imports: [CommonModule, TemplateActividadComponent, DynamicFormComponent],
  templateUrl: './actividad-alta-atm.component.html',
  styleUrl: './actividad-alta-atm.component.sass',
})
export class ActividadAltaAtmComponent {
  iniciaFecha = '2024-01-15'

  private readonly camposFechasCajero: ReadonlyArray<FieldConfig> = [
    {
      key: 'idCajero',
      tipo: 'input',
      label: 'Id Cajero',
      placeholder: 'X-90639',
      isRequired: true,
      maxLength: 20,
      disabled: true,
    },
    {
      key: 'fechaAlta',
      tipo: 'input',
      label: 'Fecha Alta',
      placeholder: 'dd/mm/yyyy',
      isRequired: true,
    },
    {
      key: 'fechaModificacion',
      tipo: 'input',
      label: 'Fecha Modificación',
      placeholder: 'dd/mm/yyyy',
      isRequired: false,
    },
    {
      key: 'fechaReal',
      tipo: 'input',
      label: 'Fecha Real',
      placeholder: 'dd/mm/yyyy',
      isRequired: false,
      disabled: true,
    },
  ]

  private readonly camposAccionMigracion: ReadonlyArray<FieldConfig> = [
    {
      key: 'responsableAccion',
      tipo: 'select',
      label: 'Responsable Acción',
      isRequired: true,
      options: [
        { value: 'instalacionAtms', label: "Instalación ATM's" },
        { value: 'negocioAtms', label: 'Negocio ATM’s' },
        { value: 'banca', label: 'Banca' },
        { value: 'nomina', label: 'Nómina' },
        { value: 'cliente', label: 'Cliente' },
      ],
    },
    {
      key: 'tipoAccion',
      tipo: 'select',
      label: 'Tipo de Acción',
      isRequired: true,
      options: [
        { value: 'configuracionAtm', label: 'Configuración ATM' },
        { value: 'instalacionEquipo', label: 'Instalación de equipo' },
        { value: 'actualizacion', label: 'Actualización de software' },
        { value: 'retiro', label: 'Retiro de equipo' },
      ],
    },
    {
      key: 'migracionMedio',
      tipo: 'select',
      label: 'Migración de Medio',
      isRequired: true,
      options: [
        { value: 'temporal', label: 'Temporal' },
        { value: 'permanente', label: 'Permanente' },
      ],
    },
  ]

  camposAlta = signal(this.camposFechasCajero)
  camposAccion = signal(this.camposAccionMigracion)

  private readonly NUM_FORMS = 2

  @Output() updAvance = new EventEmitter<number>()

  onGuardar(e: { values: Record<string, unknown>; files: Record<string, File | null> }): void {
    console.log('[PADRE:GUARDAR] values =>', e.values)
    console.log('[PADRE:GUARDAR] files  =>', e.files)
    this.updAvance.emit(100 / this.NUM_FORMS)
  }
}
