import { ErrorHandler, Injectable, isDevMode } from '@angular/core'
import { LoggerService } from '../../shared/services/logger-service'

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private logger: LoggerService) {}
  handleError(error: unknown): void {
    this.logger.error('Unhandled error', { ctx: 'GlobalError', data: error })
    if (isDevMode()) throw error
  }
}
