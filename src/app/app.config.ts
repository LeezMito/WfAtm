import { ApplicationConfig, ErrorHandler } from '@angular/core'
import { provideRouter } from '@angular/router'

import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideClientHydration } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { routes } from './app.routes'
import { GlobalErrorHandler } from './core/handler/global-error-handler'
import { httpErrorInterceptor } from './core/interceptor/http-error-interceptor'
import { provideMaterial } from './shared/providers/material.providers'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideMaterial(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
  ],
}
