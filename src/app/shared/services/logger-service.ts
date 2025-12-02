import { Injectable, isDevMode } from '@angular/core'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
interface LogOptions {
  ctx?: string
  data?: unknown
}

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private dev = isDevMode()

  log(level: LogLevel, msg: string, opt: LogOptions = {}): void {
    if (!this.dev && (level === 'debug' || level === 'info')) return
    const prefix = opt.ctx ? `[${opt.ctx}]` : ''
    const payload = opt.data ? [msg, opt.data] : [msg]
    switch (level) {
      case 'debug':
        console.debug(prefix, ...payload)
        break
      case 'info':
        console.info(prefix, ...payload)
        break
      case 'warn':
        console.warn(prefix, ...payload)
        break
      case 'error':
        console.error(prefix, ...payload)
        break
    }
  }

  debug(msg: string, opt?: LogOptions) {
    this.log('debug', msg, opt)
  }
  info(msg: string, opt?: LogOptions) {
    this.log('info', msg, opt)
  }
  warn(msg: string, opt?: LogOptions) {
    this.log('warn', msg, opt)
  }
  error(msg: string, opt?: LogOptions) {
    this.log('error', msg, opt)
  }
}
