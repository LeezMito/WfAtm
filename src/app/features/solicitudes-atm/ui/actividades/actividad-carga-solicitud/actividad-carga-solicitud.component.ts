import { CommonModule } from '@angular/common'
import { Component, effect, EventEmitter, input, OnInit, Output, signal } from '@angular/core'
import { createDynamicFormSignalController } from '../../../../../shared/interfaces/dynamic-form.controller'
import { FieldConfig } from '../../../../../shared/interfaces/dynamic-form.interface'
import { DynamicFormComponent } from '../../../../../shared/ui/dynamic-form/dynamic-form.component'
import { TemplateActividadComponent } from '../../../../../shared/ui/template-actividad/template-actividad.component'
import { FormularioValues } from '../../../interfaces/step-actividad.interface'

@Component({
  selector: 'app-actividad-carga-solicitud',
  standalone: true,
  imports: [CommonModule, TemplateActividadComponent, DynamicFormComponent],
  templateUrl: './actividad-carga-solicitud.component.html',
  styleUrl: './actividad-carga-solicitud.component.sass',
})
export class ActividadCargaSolicitudComponent implements OnInit {
  iniciaFecha = '2024-01-15'

  private readonly camposDatosForm: ReadonlyArray<FieldConfig> = [
    {
      key: 'nombreSitio',
      tipo: 'input',
      label: 'Nombre del sitio a instalar',
      placeholder: 'Escribe el nombre del sitio',
      isRequired: false,
      maxLength: 120,
    },
    {
      key: 'compromiso',
      tipo: 'select',
      label: 'Compromiso',
      isRequired: false,
      options: [
        { value: 'cobertura-servicio', label: 'Cobertura y servicio' },
        { value: 'reubicacion-nueva-direccion', label: 'Reubicación nueva dirección' },
        { value: 'reactivacion-nueva-direccion', label: 'Reactivación nueva dirección' },
        { value: 'baja-temporal', label: 'Baja temporal' },
        { value: 'baja-definitiva', label: 'Baja definitiva' },
        { value: 'reubicacion-misma-direccion', label: 'Reubicación misma dirección' },
        { value: 'reactivacion-misma-direccion', label: 'Reactivación misma dirección' },
        { value: 'otro', label: 'Otro' },
        { value: 'caso-especial', label: 'Caso especial' },
      ],
    },
    {
      key: 'otro',
      tipo: 'select',
      label: 'Otro',
      placeholder: 'Especifica el compromiso',
      maxLength: 120,
      disabled: false,
      options: [
        {
          value: 'sustitucion-dispensador-multicajero',
          label: 'Sustitución Dispensador por Multicajero',
        },
        { value: 'migracion-fo', label: 'Migración FO' },
        { value: 'instalacion-ac', label: 'Instalación de AC' },
        { value: 'instalacion-imagen', label: 'Instalación de imagen' },
      ],
    },
    {
      key: 'numAtm',
      tipo: 'input',
      label: 'Num. ATM',
      placeholder: 'Ej. 12345',
      minLength: 1,
      maxLength: 10,
    },
    {
      key: 'idCajero',
      tipo: 'input',
      label: 'Id Cajero',
      placeholder: 'ID del cajero',
      maxLength: 30,
    },
    {
      key: 'pagoRenta',
      tipo: 'input',
      label: 'Pago de Renta',
      placeholder: 'Monto mensual',
      minValue: 0,
      maxValue: 99999999,
    },
    {
      key: 'cedulaRentabilidad',
      tipo: 'file',
      label: 'Cédula de Rentabilidad',
      fileExt: ['xls', 'xlsx'],
      isRequired: false,
    },
    {
      key: 'totalTrx',
      tipo: 'input',
      label: "Total TRX's",
      placeholder: 'Número de transacciones',
      minValue: 0,
      maxValue: 999999999,
    },
    {
      key: 'region',
      tipo: 'select',
      label: 'Región',
      isRequired: false,
      options: [
        { value: 'norte', label: 'Norte' },
        { value: 'centro', label: 'Centro' },
        { value: 'sur', label: 'Sur' },
      ],
    },
    {
      key: 'observacion',
      tipo: 'textarea',
      label: 'Observación',
      placeholder: 'Notas adicionales',
      maxLength: 500,
    },
  ]

  private readonly camposUbicacionForm: ReadonlyArray<FieldConfig> = [
    {
      key: 'cp',
      tipo: 'input',
      label: 'C.P.',
      placeholder: '56880',
      isRequired: false,
      minLength: 5,
      maxLength: 5,
    },
    {
      key: 'estado',
      tipo: 'input',
      label: 'Estado',
      placeholder: 'México',
      isRequired: false,
      maxLength: 60,
    },
    { key: 'municipio', tipo: 'input', label: 'Municipio', isRequired: false, maxLength: 80 },
    { key: 'ciudad', tipo: 'input', label: 'Ciudad', isRequired: false, maxLength: 80 },
    { key: 'colonia', tipo: 'input', label: 'Colonia', isRequired: false, maxLength: 80 },
    { key: 'calle', tipo: 'input', label: 'Calle', isRequired: false, maxLength: 120 },
    { key: 'numero', tipo: 'input', label: 'Número', placeholder: 'S/N', maxLength: 20 },
    { key: 'entreCalles', tipo: 'input', label: 'Entre calles', maxLength: 160 },

    {
      key: 'urlMapa',
      tipo: 'textarea',
      label: 'Pegar URL Mapa',
      placeholder: 'https://maps.google.com/...',
      maxLength: 2000,
    },
    {
      key: 'coordLat',
      tipo: 'input',
      label: 'Coordenadas (Lat)',
      placeholder: '19.1014559',
      minValue: -90,
      maxValue: 90,
    },
    {
      key: 'coordLng',
      tipo: 'input',
      label: 'Coordenadas (Lng)',
      placeholder: '-98.8812324',
      minValue: -180,
      maxValue: 180,
    },
    {
      key: 'showMap',
      tipo: 'button',
      label: 'Mostrar Mapa',
      style: 'primary-fill',
      icon: 'map',
    },

    {
      key: 'medioEnlace',
      tipo: 'select',
      label: 'Medio de Enlace',
      isRequired: false,
      options: [
        { value: 'fibra', label: 'Fibra' },
        { value: 'microondas', label: 'Microondas' },
        { value: '4g', label: '4G/LTE' },
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
      options: [
        { value: 'telmex', label: 'Telmex' },
        { value: 'izzi', label: 'Izzi' },
        { value: 'totalplay', label: 'Totalplay' },
        { value: 'otro', label: 'Otro' },
      ],
    },

    {
      key: 'besp',
      tipo: 'file',
      label: 'BESP',
      fileExt: ['xls', 'xlsx'],
      isRequired: false,
    },
  ]

  camposDatos = signal(this.camposDatosForm)
  camposUbicacion = signal(this.camposUbicacionForm)

  dfCtrl = {
    datos: createDynamicFormSignalController(),
    ubicacion: createDynamicFormSignalController(),
  }

  @Output() updAvance = new EventEmitter<number>()
  @Output() avanzarStep = new EventEmitter<FormularioValues[]>()

  formDatosStatus: FormularioValues = {}
  formUbicacionStatus: FormularioValues = {}

  modo = input<'nuevo' | 'editar' | 'detalle'>('nuevo')
  idSolicitud = input<string | undefined>(undefined)

  constructor() {
    effect(() => {
      this.modo()
      this.idSolicitud()
      console.log('Modo actual:', this.modo())
      console.log('ID Solicitud actual:', this.idSolicitud())
    })
  }

  ngOnInit() {
    if (this.modo() === 'nuevo') {
      this.macroIniciar()
    } else if (this.modo() === 'editar') {
      this.macroEditar()
    }
  }

  macroEditar() {
    this.macroIniciar()
    this.dfCtrl.datos.setProgress(100)
    this.dfCtrl.ubicacion.setProgress(100)

    this.formUbicacionStatus.visible = true
    this.formUbicacionStatus.completed = true
  }

  private macroIniciar() {
    this.formDatosStatus.name = 'datos'
    this.formDatosStatus.visible = true
    this.formDatosStatus.completed = false
    this.formUbicacionStatus.name = 'ubicacion'
    this.formUbicacionStatus.visible = false
    this.formUbicacionStatus.completed = false
  }

  onFieldChanged = (e: { key: string; value: unknown }) => {
    console.log('[PADRE:FIELD CHANGED] ', e)
    this.rulesFormDatos(e)
  }

  onClick(e: { key: string; config: FieldConfig; event: MouseEvent }) {
    console.log('[PADRE:BUTTON CLICK] ', e)
  }

  onGuardar(formName: 'datos' | 'ubicacion' = 'datos', e: FormularioValues): void {
    console.log('[PADRE:GUARDAR] formName =>', formName)
    console.log('[PADRE:GUARDAR] values =>', e)

    switch (formName) {
      case 'datos':
        this.formDatosStatus.completed = true
        this.formDatosStatus.values = e.values
        this.formDatosStatus.files = e.files
        this.formUbicacionStatus.visible = true
        if (this.formDatosStatus.completed) this.updAvance.emit(50)
        break
      case 'ubicacion':
        this.formUbicacionStatus.completed = true
        this.formUbicacionStatus.values = e.values
        this.formUbicacionStatus.files = e.files
        if (this.formUbicacionStatus.completed) this.updAvance.emit(50)
        break
    }

    console.log('[PADRE:ESTATUS FORMULARIOS] datos =>', this.formDatosStatus)

    if (this.formDatosStatus.completed === true && this.formUbicacionStatus.completed === true) {
      console.log('[PADRE:AVANZAR STEP] Emitiendo evento para avanzar step')
      console.log('[PADRE:ESTATUS FORMULARIOS] datos- =>', this.formDatosStatus)
      console.log('[PADRE:ESTATUS FORMULARIOS] ubicacion =>', this.formUbicacionStatus)

      const response: FormularioValues[] = [this.formDatosStatus, this.formUbicacionStatus]
      this.avanzarStep.emit(response)
    }
  }

  rulesFormDatos(e: { key: string; value: unknown }): void {
    console.log('[PADRE:REGLAS FORM DATOS] ', e)
    if (e.key === 'compromiso') {
      const v = String(e.value ?? '')
      if (v === 'caso-especial') {
        this.dfCtrl.datos.patchField({
          key: 'otro',
          disabled: false,
          value: '',
        })
        this.dfCtrl.datos.patchField({
          key: 'cedulaRentabilidad',
          validators: { required: false },
        })
      } else {
        this.dfCtrl.datos.patchField({
          key: 'otro',
          disabled: true,
          value: '',
        })
        this.dfCtrl.datos.patchField({
          key: 'cedulaRentabilidad',
          value: '',
          validators: { required: true },
        })
      }
    }

    if (e.key === 'cedulaRentabilidad') {
      this.dfCtrl.datos.patchField({
        key: 'totalTrx',
        value: '10584',
      })
    }
  }
}
