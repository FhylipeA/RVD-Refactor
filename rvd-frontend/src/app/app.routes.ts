import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cadastro-vendas',
    pathMatch: 'full'
  },
  {
    path: 'cadastro-vendas',
    loadChildren: () =>
      import('./features/rvd-venda/rvd-venda.module').then(m => m.RvdVendaModule)
  }
];