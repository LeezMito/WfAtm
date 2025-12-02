export interface SolicitudSection {
  titulo: string

  nombreSitio?: string
  region?: string
  responsable?: string

  fechaInicio?: string
  fechaObjetivo?: string
  diasTranscurridos?: number

  avance?: number

  coberturaServicio?: string

  responsableInstalacion?: string
  costoTraslado?: string
  medioEnlace?: string
  proveedor?: string

  escenarioSeguridad?: string
  caseta?: string
  montoSeguridad?: string
}
