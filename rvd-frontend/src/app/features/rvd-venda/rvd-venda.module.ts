import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CadastroVendasComponent } from './cadastro-vendas/cadastro-vendas.component';

const routes: Routes = [
  {
    path: '',
    component: CadastroVendasComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CadastroVendasComponent,
  ]
})
export class RvdVendaModule {}