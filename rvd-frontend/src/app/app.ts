import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FiltroStateService } from './core/services/filtro-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header
      (lojaChange)="filtroState.setLoja($event)"
      (departamentoChange)="filtroState.setDepartamento($event)"
      (dataChange)="filtroState.setData($event)"
      (buscarClick)="filtroState.triggerBuscar()">
    </app-header>
    <div class="app-content">
      <router-outlet />
    </div>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('RVD Vendas');
  readonly filtroState = inject(FiltroStateService);
}