import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { LoggerService } from '../../shared/services/logger-service'

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService)
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        logger.error(`HTTP ${err.status} ${req.method} ${req.url}`, {
          ctx: 'HTTP',
          data: err.error,
        })
      } else {
        logger.error('HTTP unknown error', { ctx: 'HTTP', data: err })
      }
      return throwError(() => err)
    })
  )
}
