import { CommonModule } from '@angular/common'
import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core'
import { createDynamicFormSignalController } from '../../../../../shared/interfaces/dynamic-form.controller'
import { FieldConfig } from '../../../../../shared/interfaces/dynamic-form.interface'
import { DynamicFormComponent } from '../../../../../shared/ui/dynamic-form/dynamic-form.component'
import { TemplateActividadComponent } from '../../../../../shared/ui/template-actividad/template-actividad.component'
import { FormularioValues } from '../../../interfaces/step-actividad.interface'

@Component({
  selector: 'app-actividad-validacion-tecnica',
  standalone: true,
  imports: [CommonModule, TemplateActividadComponent, DynamicFormComponent],
  templateUrl: './actividad-validacion-tecnica.component.html',
  styleUrl: './actividad-validacion-tecnica.component.sass',
})
export class ActividadValidacionTecnicaComponent implements OnInit {
  iniciaFecha = '2024-01-15'

  private readonly camposATM: ReadonlyArray<FieldConfig> = [
    {
      key: 'idAtm',
      tipo: 'input',
      label: 'Id ATM',
      placeholder: 'Ej. 123456',
      isRequired: false,
      minLength: 1,
      maxLength: 20,
    },
    {
      key: 'nombreAtm',
      tipo: 'input',
      label: 'Nombre del ATM',
      placeholder: 'Nombre descriptivo',
      isRequired: false,
      maxLength: 120,
    },
    {
      key: 'responsableInstalacion',
      tipo: 'select',
      label: 'Responsable Instalación',
      isRequired: false,
      options: [
        { value: 'infra', label: 'Infraestructura' },
        { value: 'proveedor', label: 'Proveedor externo' },
        { value: 'sucursal', label: 'Sucursal' },
        { value: 'otro', label: 'Otro' },
      ],
    },
    {
      key: 'observaciones',
      tipo: 'textarea',
      label: 'Observaciones',
      placeholder: 'Notas adicionales',
      maxLength: 500,
    },
  ]

  private readonly camposVisitaPreliminar: ReadonlyArray<FieldConfig> = [
    {
      key: 'visitaPreliminar',
      tipo: 'file',
      label: 'Visita Preliminar',
      fileExt: ['pdf', 'jpg', 'jpeg', 'png', 'xls', 'xlsx'],
      isRequired: false,
    },
    {
      key: 'razonNuevaCarga',
      tipo: 'textarea',
      label: 'Razón de nueva carga',
      placeholder: 'Describe el motivo por el cual se realiza una nueva carga',
      isRequired: false,
      maxLength: 500,
    },
  ]

  private readonly camposValidaCobertura: ReadonlyArray<FieldConfig> = [
    {
      key: 'medioEnlace',
      tipo: 'select',
      label: 'Medio de Enlace',
      isRequired: false,
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
      key: 'proveedor',
      tipo: 'select',
      label: 'Proveedor',
      isRequired: false,
      options: [
        { value: 'telmex', label: 'TELMEX' },
        { value: 'totalplay', label: 'Totalplay' },
        { value: 'izzi', label: 'Izzi' },
        { value: 'axtel', label: 'Axtel' },
        { value: 'megacable', label: 'Megacable' },
        { value: 'otro', label: 'Otro' },
      ],
    },
  ]

  private readonly camposCoberturaCtv: ReadonlyArray<FieldConfig> = [
    {
      key: 'pendienteCobertura',
      tipo: 'select',
      label: 'Pendiente por cobertura',
      options: [
        { value: 'si', label: 'Sí' },
        { value: 'no', label: 'No' },
      ],
      isRequired: false,
    },

    {
      key: 'voBoCobertura',
      tipo: 'select',
      label: 'Vo.Bo Cobertura',
      options: [
        { value: 'si', label: 'Sí' },
        { value: 'no', label: 'No' },
      ],
    },

    {
      key: 'costoTrasladoValores',
      tipo: 'input',
      label: 'Costo Traslado de Valores',
      placeholder: '17,500',
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

  camposDatos = signal(this.camposATM)
  camposVisita = signal(this.camposVisitaPreliminar)
  camposValida = signal(this.camposValidaCobertura)
  camposCobertura = signal(this.camposCoberturaCtv)

  dfCtrl = createDynamicFormSignalController()

  @Output() updAvance = new EventEmitter<number>()
  @Output() avanzarStep = new EventEmitter<FormularioValues[]>()

  formDatos: FormularioValues = {}
  formVisita: FormularioValues = {}
  formValida: FormularioValues = {}
  formCobertura: FormularioValues = {}

  ngOnInit() {
    this.formDatos.name = 'datosAtm'
    this.formDatos.visible = true
    this.formDatos.completed = false
    this.formVisita.name = 'visitaSitio'
    this.formVisita.visible = false
    this.formVisita.completed = false
    this.formValida.name = 'validaCobertura'
    this.formValida.visible = false
    this.formValida.completed = false
    this.formCobertura.name = 'coberturaCtv'
    this.formCobertura.visible = false
    this.formCobertura.completed = false
    console.log('ActividadValidacionTecnicaComponent initialized')
  }

  onFieldChanged = (e: { key: string; value: unknown }) => {
    console.log('[PADRE:FIELD CHANGED] ', e)
    //this.rulesFormDatos(e)
  }

  onGuardar(
    formName: 'datosAtm' | 'visitaSitio' | 'validaCobertura' | 'coberturaCtv',
    e: FormularioValues
  ): void {
    console.log('[PADRE:GUARDAR] values =>', e.values)
    console.log('[PADRE:GUARDAR] files  =>', e.files)

    switch (formName) {
      case 'datosAtm':
        this.formDatos.completed = true
        this.formDatos.values = e.values
        this.formDatos.files = e.files
        this.formVisita.visible = true
        if (this.formDatos.completed) this.updAvance.emit(25)
        break
      case 'visitaSitio':
        this.formDatos.completed = true
        this.formDatos.values = e.values
        this.formDatos.files = e.files
        this.formVisita.visible = true
        if (this.formDatos.completed) this.updAvance.emit(25)
        break
    }
  }
}
