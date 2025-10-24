import { Injectable } from '@angular/core'
import { defer, Observable, of, throwError } from 'rxjs'
import { catchError, delay } from 'rxjs/operators'

function genTraceId(prefix = 'REQ') {
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase()
  const ts = Date.now().toString(36).toUpperCase()
  return `${prefix}-${ts}-${rnd}`
}

@Injectable({ providedIn: 'root' })
export class SolicitudesMockApiService {
  private data = [
    {
      noSolicitud: '20250613.3945',
      tipoCajero: 'Empresarial',
      bucGrupo: '1795820',
      razonSocial: 'EMBOTELLADORAS BEPENSA S.A. DE C.V.',
      totalATMs: 1,
      avanceSolicitud: 0.18,
      estatusSolicitud: 'En proceso',
      actividadActual: 2,
      estatusActividad: 'Iniciada',
      banca: 'Empresas',
      region: 'Sureste',
    },
    {
      noSolicitud: '20250612.3944',
      tipoCajero: 'Empresarial',
      bucGrupo: '6350393',
      razonSocial: 'SECRETARÍA DE LA HACIENDA Y CRÉDITO PÚBLICO',
      totalATMs: 1,
      avanceSolicitud: 0.3,
      estatusSolicitud: 'En proceso',
      actividadActual: 2,
      estatusActividad: 'Iniciada',
      banca: 'Instituciones',
      region: 'Occidente',
    },
    {
      noSolicitud: '20250611.3943',
      tipoCajero: 'Remoto',
      bucGrupo: '–',
      razonSocial: 'YEPAS TIENDA BOULEVARD',
      totalATMs: 1,
      avanceSolicitud: 0.18,
      estatusSolicitud: 'En proceso',
      actividadActual: 2,
      estatusActividad: 'Iniciada',
      banca: 'Empresas',
      region: 'Sureste',
    },
    {
      noSolicitud: '20250611.3942',
      tipoCajero: 'Empresarial',
      bucGrupo: '4369607',
      razonSocial: 'ÓPTICAS DEVLYN S.A. DE C.V.',
      totalATMs: 1,
      avanceSolicitud: 0.31,
      estatusSolicitud: 'En proceso',
      actividadActual: 2,
      estatusActividad: 'Iniciada',
      banca: 'Empresas',
      region: 'Metro Sur',
    },
    {
      noSolicitud: '20250611.3941',
      tipoCajero: 'Empresarial',
      bucGrupo: '4507981',
      razonSocial: 'EPL MCR S.A. DE C.V.',
      totalATMs: 1,
      avanceSolicitud: 0.25,
      estatusSolicitud: 'En proceso',
      actividadActual: 2,
      estatusActividad: 'Iniciada',
      banca: 'Empresas',
      region: 'Centro',
    },
    {
      noSolicitud: '20250610.3939',
      tipoCajero: 'Empresarial',
      bucGrupo: '4409673',
      razonSocial: 'CROWN FAMOSA S.A. DE C.V.',
      totalATMs: 1,
      avanceSolicitud: 0.3,
      estatusSolicitud: 'En proceso',
      actividadActual: 2,
      estatusActividad: 'Iniciada',
      banca: 'Scib',
      region: 'Metro Norte',
    },
    {
      noSolicitud: '20250609.3938',
      tipoCajero: 'Remoto',
      bucGrupo: '–',
      razonSocial: 'WALMART BA 1110 PLAZA EL ROSARIO',
      totalATMs: 1,
      avanceSolicitud: 0.47,
      estatusSolicitud: 'En proceso',
      actividadActual: 3,
      estatusActividad: 'Iniciada',
      banca: 'Empresas',
      region: 'Metro Norte',
    },
    {
      noSolicitud: '20250609.3937',
      tipoCajero: 'Remoto',
      bucGrupo: '–',
      razonSocial: 'WALMART BA 2240 SANTA ANITA',
      totalATMs: 1,
      avanceSolicitud: 0.47,
      estatusSolicitud: 'En proceso',
      actividadActual: 3,
      estatusActividad: 'Iniciada',
      banca: 'Empresas',
      region: 'Metro Sur',
    },
    {
      noSolicitud: '20250608.3936',
      tipoCajero: 'Empresarial',
      bucGrupo: '7324468',
      razonSocial: 'UNIVERSIDAD DE MONTERREY',
      totalATMs: 1,
      avanceSolicitud: 0.47,
      estatusSolicitud: 'En proceso',
      actividadActual: 3,
      estatusActividad: 'Iniciada',
      banca: 'Instituciones',
      region: 'Noreste',
    },
    {
      noSolicitud: '20250606.3932',
      tipoCajero: 'Remoto',
      bucGrupo: '–',
      razonSocial: 'SORIAN HÍPER SANTA LUCÍA',
      totalATMs: 1,
      avanceSolicitud: 0.38,
      estatusSolicitud: 'En proceso',
      actividadActual: 3,
      estatusActividad: 'Iniciada',
      banca: 'Empresas',
      region: 'Metro Norte',
    },
  ]

  list(params?: { estatus?: string; region?: string }): Observable<any[]> {
    const traceId = genTraceId('LIST')
    try {
      console.log(`[TRY][${traceId}] Iniciando simulación list() con params:`, params)

      return defer(() => {
        // Simula latencia y respuesta
        const filtered = this.data.filter(
          (x) =>
            (!params?.estatus || x.estatusSolicitud === params.estatus) &&
            (!params?.region || x.region === params.region)
        )
        console.log(`[TRY][${traceId}] Datos filtrados:`, filtered)
        return of(filtered)
      }).pipe(
        delay(800),
        catchError((err) => {
          console.error(`[CATCH][${traceId}] Error simulado:`, err)
          return throwError(() => ({ traceId, error: err }))
        })
      )
    } catch (err) {
      console.error(`[CATCH][${traceId}] Error general:`, err)
      return throwError(() => ({ traceId, error: err }))
    }
  }
}
