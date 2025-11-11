import { Routes } from '@angular/router'

export const SOLICITUDES_ATM: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/solicitud-lista-page/solicitud-lista-page.component').then(
        (c) => c.SolicitudListaPageComponent
      ),
  },
  {
    path: 'nuevo/:tipoAtm',
    loadComponent: () =>
      import('../pages/solicitud-nuevo-page/solicitud-nuevo-page.component').then(
        (c) => c.SolicitudNuevoPageComponent
      ),
  },
  {
    path: 'editar/:tipoAtm/:idSolicitud',
    loadComponent: () =>
      import('../pages/solicitud-editar-page/solicitud-editar-page.component').then(
        (c) => c.SolicitudEditarPageComponent
      ),
  },
]
