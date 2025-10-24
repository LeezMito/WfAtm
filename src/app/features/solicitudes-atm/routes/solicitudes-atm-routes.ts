import { Routes } from '@angular/router'

export const SOLICITUDES_ATM: Routes = [
  { path: '', 
    loadComponent: () => 
      import('../pages/solicitud-lista-page/solicitud-lista-page.component').then(
        c => c.SolicitudListaPageComponent
      )
  },
  { path: 'nuevo', 
    loadComponent: () => 
      import('../pages/solicitud-lista-page/solicitud-lista-page.component')
        .then(c => c.SolicitudListaPageComponent) 
  },
]