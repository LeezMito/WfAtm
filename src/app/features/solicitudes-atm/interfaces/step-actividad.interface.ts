export interface StepActividad {
  id: number
  nombre: string
  activo: boolean
  bloqueado: boolean
  visiblePara: string[]
  progreso: number

  formsValues?: FormularioValues[] | null
}

export enum CAT_ACTIVIDADES {
  CARGA_SOLICITUD = 1,
  VALIDACION_TECNICA = 2,
  VALIDACION_VISITA = 3,
  VALIDACION_OPERACIONES = 4,
  VALIDACION_NEGOCIO = 7,
  INSTALACION = 9,
  ALTA_ATM = 11,
}

export const FlujoRemoto: StepActividad[] = [
  {
    id: CAT_ACTIVIDADES.CARGA_SOLICITUD,
    nombre: 'Actividad 1',
    activo: true,
    bloqueado: false,
    visiblePara: ['Super Admin'],
    progreso: 100,
  },
  {
    id: CAT_ACTIVIDADES.VALIDACION_TECNICA,
    nombre: 'Actividad 2',
    activo: false,
    bloqueado: true,
    visiblePara: ['Super Admin', 'Técnico'],
    progreso: 0,
  },
  {
    id: CAT_ACTIVIDADES.VALIDACION_VISITA,
    nombre: 'Actividad 3',
    activo: false,
    bloqueado: true,
    visiblePara: ['Super Admin', 'Operaciones'],
    progreso: 0,
  },
  {
    id: CAT_ACTIVIDADES.VALIDACION_OPERACIONES,
    nombre: 'Actividad 4',
    activo: false,
    bloqueado: true,
    visiblePara: ['Super Admin', 'Operaciones'],
    progreso: 0,
  },
  {
    id: CAT_ACTIVIDADES.VALIDACION_NEGOCIO,
    nombre: 'Actividad 7',
    activo: false,
    bloqueado: true,
    visiblePara: ['Super Admin', 'Negocio'],
    progreso: 0,
  },
  {
    id: CAT_ACTIVIDADES.INSTALACION,
    nombre: 'Actividad 9',
    activo: false,
    bloqueado: true,
    visiblePara: ['Super Admin', 'Instalador'],
    progreso: 0,
  },
  {
    id: CAT_ACTIVIDADES.ALTA_ATM,
    nombre: 'Actividad 10',
    activo: false,
    bloqueado: true,
    visiblePara: ['Super Admin'],
    progreso: 0,
  },
]

export interface FormularioValues {
  values?: Record<string, unknown>
  files?: Record<string, File | null>
  name?: string
  visible?: boolean
  completed?: boolean
}

export enum Modo {
  NEW = 1,
  UPD = 2,
  SHOW = 3,
}
