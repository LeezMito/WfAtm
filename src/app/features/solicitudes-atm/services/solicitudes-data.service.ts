import { Injectable, inject } from '@angular/core'
import { Observable, catchError, shareReplay, throwError } from 'rxjs'
import { SolicitudesMockApiService } from './solicitudes-mock-api.service'

function genTraceId(prefix = 'CACHE') {
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase()
  const ts = Date.now().toString(36).toUpperCase()
  return `${prefix}-${ts}-${rnd}`
}

@Injectable({ providedIn: 'root' })
export class SolicitudesDataService {
  private api = inject(SolicitudesMockApiService)
  private cache = new Map<string, { expiry: number; obs: Observable<any[]> }>()

  list(params?: { estatus?: string; region?: string }, ttlMs = 60000): Observable<any[]> {
    const traceId = genTraceId('LIST')
    try {
      console.log(`[TRY][${traceId}] Consultando lista, params:`, params)
      const key = JSON.stringify(params ?? {})
      const now = Date.now()
      const cached = this.cache.get(key)

      if (cached && cached.expiry > now) {
        console.log(`[TRY][${traceId}] HIT de caché para`, key)
        return cached.obs
      }

      console.log(`[TRY][${traceId}] MISS de caché, llamando al mock API`)
      const obs$ = this.api.list(params).pipe(
        shareReplay({ bufferSize: 1, refCount: false, windowTime: ttlMs }),
        catchError((err) => {
          console.error(`[CATCH][${traceId}] Error en list():`, err)
          return throwError(() => err)
        })
      )

      this.cache.set(key, { obs: obs$, expiry: now + ttlMs })
      return obs$
    } catch (err) {
      console.error(`[CATCH][${traceId}] Error general en DataService:`, err)
      return throwError(() => err)
    }
  }

  invalidate(params?: { estatus?: string; region?: string }) {
    const traceId = genTraceId('INVALIDATE')
    try {
      const key = JSON.stringify(params ?? {})
      console.log(`[TRY][${traceId}] Invalida caché para`, key)
      this.cache.delete(key)
    } catch (err) {
      console.error(`[CATCH][${traceId}]`, err)
    }
  }
}
