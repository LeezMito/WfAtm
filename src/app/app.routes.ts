import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '', redirectTo: 'solicitudes-atm', pathMatch: 'full' },
  {
    path: 'solicitudes-atm',
    loadChildren: () =>
      import('./features/solicitudes-atm/routes/solicitudes-atm-routes').then(
        (m) => m.SOLICITUDES_ATM
      ),
  },
  { path: '**', redirectTo: '' },
]
