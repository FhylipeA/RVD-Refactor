import { Component, signal, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})


export class HeaderComponent implements OnInit {
  isDarkMode = signal(false);
  toggleDarkMode = output<boolean>();

  lojas = signal<any[]>([]);
  lojaSelecionada = signal<any>(null);
  departamentoSelecionado = signal<string>('');
  dataSelecionada = signal<Date>(new Date());

  lojaChange = output<any>();
  departamentoChange = output<string>();
  dataChange = output<Date>();
  buscarClick = output<void>();


  ngOnInit(): void {
    this.lojas.set([
      {
        idloja: 1,
        nome: 'Matriz Centro',
        dePara_LinxDms: '1.1',
        bandeira_idbandeira: 12,
        rvdVendas: [
          {
            departamento_iddepartamento: 'N',
            descricao_departamento: 'Novos',
            integracao: '1;1;N|1',
            legado: 'APOLLO',
            loja_nome_bandeira: 'GM',
            departamento: 'Novos',
            dePara_LinxDms: '1',
          }
        ]
      }
    ]);
  }

  get departamentos() {
    return this.lojaSelecionada()?.rvdVendas ?? [];
  }

  onToggleDarkMode() {
    const novo = !this.isDarkMode();
    this.isDarkMode.set(novo);
    document.documentElement.classList.toggle('dark', novo);
    this.toggleDarkMode.emit(novo);
  }

  onLojaChange(loja: any) {
    this.lojaSelecionada.set(loja);
    this.departamentoSelecionado.set('');
    this.lojaChange.emit(loja);
  }

  onDepartamentoChange(dep: string) {
    this.departamentoSelecionado.set(dep);
    this.departamentoChange.emit(dep);
  }

  onDataChange(data: Date) {
    this.dataSelecionada.set(data);
    this.dataChange.emit(data);
  }

  onBuscar() {
    this.buscarClick.emit();
  }

  getUserInitials(): string {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    const name = user?.name ?? user?.displayName ?? 'RV';
    return name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase();
  }

  getUserName(): string {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    return user?.name ?? user?.displayName ?? 'Usuário';
  }

  getUserRole(): string {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    return user?.role ?? user?.jobTitle ?? 'Gerente Comercial';
  }
}