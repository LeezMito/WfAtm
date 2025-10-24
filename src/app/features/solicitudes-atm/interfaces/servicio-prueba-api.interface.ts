export interface SolicitudApi {
  noSolicitud: string
  tipoCajero: 'Empresarial' | 'Remoto' | string
  bucGrupo: string
  razonSocial: string
  totalATMs: number
  avanceSolicitud: number // 0.18 = 18 %
  estatusSolicitud: string
  actividadActual: number
  estatusActividad: string
  banca: string
  region: string
}
