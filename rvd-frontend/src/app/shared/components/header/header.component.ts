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
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
    RouterLink,
    RouterLinkActive,
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
  departamentoChange = output<any>();
  dataChange = output<Date>();
  buscarClick = output<void>();

  private readonly http = inject(HttpClient);

  readonly departamentos = [
    { codigo: 'N', descricao: 'Novos' },
    { codigo: 'S', descricao: 'Seminovos' },
  ];

  async ngOnInit(): Promise<void> {
    try {
      const lojas = await firstValueFrom(
        this.http.get<any[]>('/api/lojas')
      );
      this.lojas.set(lojas);
      if (lojas.length === 1) {
        this.onLojaChange(lojas[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
    }
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
    const loja = this.lojaSelecionada();
    const depDescricao = this.departamentos.find(d => d.codigo === dep)?.descricao ?? '';
    const integracao = {
      departamento_iddepartamento: dep,
      descricao_departamento: depDescricao,
      legado: loja?.legado ?? 'NBS',
      loja_nome_bandeira: loja?.loja_nome_bandeira ?? '',
      loja_idloja: loja?.idloja,
      dePara_LinxDms: loja?.dePara_LinxDms,
    };
    this.departamentoChange.emit(integracao);
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