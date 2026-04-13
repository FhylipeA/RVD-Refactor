import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { format } from 'date-fns';
import { CadastroVendasService } from './cadastro-vendas.service';
import type {
  RvdVenda,
  FiltrosTabela,
  MaisInformacoes
} from '../interfaces/rvd-venda.interface';
import {
  COLUNAS_DEFAULT,
  COLUNAS_GM,
  COLUNAS_HYUNDAI,
  COLUNAS_NBS
} from '../interfaces/rvd-venda.interface';
import { FiltroStateService } from '../../../core/services/filtro-state.service';
import { DialogInfoComponent } from './dialogs/dialog-info/dialog-info.component';
import type { DialogInfoData } from './dialogs/dialog-info/dialog-info.component';
import { DialogCadPremiumComponent } from './dialogs/dialog-cad-premium/dialog-cad-premium.component';
import type { DialogCadPremiumData } from './dialogs/dialog-cad-premium/dialog-cad-premium.component';
import { BrlCurrencyPipe } from '../../../shared/pipes/brl-currency.pipe';




const CAMPOS_NUMERICOS: (keyof RvdVenda)[] = [
  'valor_sinal', 'valor_compra', 'correcao_faturamento', 'bonus',
  'outros_bonus', 'acessorios', 'valor_financiado', 'acessorios_nf',
  'outros_nf', 'brinde', 'valor_consorcio', 'despachante', 'seguro',
  'bonus_complementar', 'despesas_vendas', 'plus_antecipado', 'top'
];

const VALORES_DEFAULT: Partial<RvdVenda> = {
  status_a_faturar: null,
  valor_sinal: 0,
  valor_compra: null,
  veiculo_capturado: null,
  correcao_faturamento: 0,
  bonus: 0,
  outros_bonus: 0,
  acessorios: 0,
  valor_financiado: 0,
  acessorios_nf: 0,
  outros_nf: 0,
  brinde: 0,
  banco: null,
  valor_consorcio: 0,
  consorcio: null,
  tabela: null,
  despachante: 0,
  seguro: 0,
  bonus_complementar: 0,
  despesas_vendas: 0,
  plus_antecipado: 0,
  top: 0,
};

@Component({
  selector: 'app-cadastro-vendas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrlCurrencyPipe,
  ],
  templateUrl: './cadastro-vendas.component.html',
  styleUrls: ['./cadastro-vendas.component.scss'],
})
export class CadastroVendasComponent implements OnInit {
  private readonly cadastroVendasService = inject(CadastroVendasService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly filtroState = inject(FiltroStateService);


  @ViewChild('tableWrapper') tableWrapperRef!: ElementRef;

  scrollTabela(amount: number): void {
    const wrapper = document.querySelector('.table-wrapper') as HTMLElement;
    if (wrapper) {
      wrapper.scrollLeft += amount;
    }
  }



  // Estado principal
  vendas = signal<RvdVenda[]>([]);
  vendasOriginal = signal<RvdVenda[]>([]);
  displayedColumns = signal<string[]>(COLUNAS_DEFAULT);

  // Estado da UI
  carregando = signal(false);
  tabelaVisivel = signal(false);
  mostrarFiltros = signal(false);
  mostrarBotaoSalvar = signal(false);
  enableAFaturarPremium = signal(false);

  // Filtros
  filtros = signal<FiltrosTabela>({
    global: '',
    status: '',
    vendedor: '',
    statusAFaturar: '',
  });

  // Seletores
  lojaSelecionada = signal<any>(null);
  departamentoSelecionado = signal<string>('');
  integracao = signal<any>(null);
  dataSelecionada = signal<Date>(new Date());

  // Listas de suporte
  bancos = signal<{ nome: string }[]>([]);
  consorcios = signal<{ id: number; consorcio: string }[]>([]);
  vendedores = signal<string[]>([]);

  // Dados do gráfico
  dadosGrafico = computed(() => {
    const vendas = this.vendas();
    return [
      { nome: 'Faturado', valor: vendas.filter(v => v.status_a_faturar === 'REALIZADO').length, cor: '#10b981', filtro: 'REALIZADO' },
      { nome: 'A Faturar', valor: vendas.filter(v => v.status_a_faturar === 'PENDENTE').length, cor: '#f59e0b', filtro: 'PENDENTE' },
      { nome: 'Negociando', valor: vendas.filter(v => !v.status_a_faturar).length, cor: '#94a3b8', filtro: '' },
      { nome: 'Devolvido', valor: vendas.filter(v => v.status_a_faturar === 'DEVOLVIDO').length, cor: '#ef4444', filtro: 'DEVOLVIDO' },
    ];
  });

  // Vendas filtradas
  vendasFiltradas = computed(() => {
    const filtros = this.filtros();
    return this.vendas().filter(venda => {
      const matchGlobal = !filtros.global ||
        JSON.stringify(venda).toLowerCase().includes(filtros.global.toLowerCase());
      const matchStatus = !filtros.status ||
        venda.maisInformacoes?.status === filtros.status;
      const matchVendedor = !filtros.vendedor ||
        venda.nome_usuario_dms === filtros.vendedor;
      const matchStatusAFaturar = !filtros.statusAFaturar ||
        venda.status_a_faturar === filtros.statusAFaturar;
      return matchGlobal && matchStatus && matchVendedor && matchStatusAFaturar;
    });
  });

  // Contagem de modificações
  totalModificacoes = computed(() =>
    this.dadosModificados().length
  );

  readonly TIPOS_BONUS = [
    null, 'Trade-In', 'Vendeu Ganhou', 'Equalização', 'Aging',
    'Carrossel', 'Bônus Especial', 'Fidelidade GM', 'Bônus Retail',
    'Bônus Conquest', 'Bônus Loyalty', 'Bônus Varejo'
  ];

  readonly TABELAS = [null, ...Array.from({ length: 25 }, (_, i) => i + 1)];


  constructor() {
    effect(() => {
      const trigger = this.filtroState.buscarTrigger();
      if (trigger > 0) {
        const loja = this.filtroState.lojaSelecionada();
        const dep = this.filtroState.departamentoSelecionado();
        const data = this.filtroState.dataSelecionada();
        if (loja && dep) {
          this.lojaSelecionada.set(loja);
          this.departamentoSelecionado.set(dep);
          this.dataSelecionada.set(data);
          this.filtrarDepartamento().then(() => this.buscarVendas());
        }
      }
    });
  }

  ngOnInit(): void {
    this.carregarBancos();
    this.carregarConsorcios();
  }

  private async carregarBancos(): Promise<void> {
    try {
      const bancos = await this.cadastroVendasService.getBancos();
      this.bancos.set([
        { nome: null as any },
        { nome: 'OUTROS' },
        { nome: 'EXTERNO' },
        { nome: 'BANCO BMW' },
        ...bancos,
      ]);
    } catch {
      this.snackBar.open('Erro ao carregar bancos', 'x', { duration: 3000 });
    }
  }

  private async carregarConsorcios(): Promise<void> {
    try {
      const consorcios = await this.cadastroVendasService.getConsorcios();
      this.consorcios.set([
        { id: null as any, consorcio: null as any },
        { id: 0, consorcio: 'OUTROS' },
        ...consorcios,
      ]);
    } catch {
      this.snackBar.open('Erro ao carregar consórcios', 'x', { duration: 3000 });
    }
  }

  async filtrarLoja(loja: any): Promise<void> {
    this.lojaSelecionada.set(loja);
    this.mostrarBotaoSalvar.set(false);
    this.tabelaVisivel.set(false);
    if (this.integracao()) await this.filtrarDepartamento();
  }

  async filtrarDepartamento(): Promise<void> {
    const loja = this.lojaSelecionada();
    const departamento = this.departamentoSelecionado();
    if (!loja || !departamento) return;
    const integracao = loja.rvdVendas?.find(
      (obj: any) => obj.departamento_iddepartamento === departamento
    );
    this.integracao.set(integracao ?? null);
  }

  async buscarVendas(): Promise<void> {
    const loja = this.lojaSelecionada();
    const integracao = this.integracao();
    if (!loja || !integracao) return;

    this.carregando.set(true);
    this.tabelaVisivel.set(false);

    try {
      const periodo = format(this.dataSelecionada(), 'yyyy-MM');
      const { response, enableAFaturarPremium } =
        await this.cadastroVendasService.getVendasRvd(
          loja.idloja,
          loja.dePara_LinxDms,
          periodo,
          integracao
        );

      if (!response.length) {
        this.snackBar.open('Nenhum dado encontrado', 'x', { duration: 3000 });
        this.vendas.set([]);
        return;
      }

      this.enableAFaturarPremium.set(enableAFaturarPremium);
      this.definirColunas(loja.bandeira_idbandeira);
      this.vendas.set(response);
      this.vendasOriginal.set(structuredClone(response));
      this.atualizarVendedores();
      this.tabelaVisivel.set(true);
      this.mostrarFiltros.set(true);
    } catch {
      this.snackBar.open('Erro ao buscar dados', 'x', { duration: 3000 });
    } finally {
      this.carregando.set(false);
    }
  }

  private definirColunas(bandeira: number): void {
    const mapa: Record<number, string[]> = {
      12: COLUNAS_GM,
      13: COLUNAS_HYUNDAI,
      17: COLUNAS_NBS,
      18: COLUNAS_NBS,
    };
    this.displayedColumns.set(mapa[bandeira] ?? COLUNAS_DEFAULT);
  }

  private atualizarVendedores(): void {
    const unicos = [...new Set(this.vendas().map(v => v.nome_usuario_dms).filter(Boolean))];
    this.vendedores.set(unicos.sort() as string[]);
  }

  private dadosModificados(): RvdVenda[] {
    return this.vendas().filter((venda, i) => {
      const original = this.vendasOriginal()[i];
      return JSON.stringify(venda) !== JSON.stringify(original);
    });
  }

  marcarModificado(): void {
    this.mostrarBotaoSalvar.set(true);
  }

  onBlurCampoNumerico(venda: RvdVenda, campo: keyof RvdVenda): void {
    if (!venda[campo]) {
      (venda as any)[campo] = 0;
    }
    this.marcarModificado();
  }

  resetarLinha(venda: RvdVenda): void {
    this.mostrarBotaoSalvar.set(true);
    Object.assign(venda, VALORES_DEFAULT);
  }

  async salvarAlteracoes(): Promise<void> {
    const modificados = this.dadosModificados();
    if (!modificados.length) {
      this.snackBar.open('Nenhuma alteração detectada', undefined, { duration: 3000 });
      return;
    }

    try {
      await this.cadastroVendasService.createOrUpdateVendas(modificados);
      this.mostrarBotaoSalvar.set(false);
      this.snackBar.open('Alterações salvas com sucesso', undefined, { duration: 3000 });
      await this.buscarVendas();
    } catch {
      this.snackBar.open('Erro ao salvar alterações', 'x', { duration: 3000 });
    }
  }

  descartarAlteracoes(): void {
    this.vendas.set(structuredClone(this.vendasOriginal()));
    this.mostrarBotaoSalvar.set(false);
    this.snackBar.open('Alterações descartadas', undefined, { duration: 3000 });
  }

  aplicarFiltro(campo: keyof FiltrosTabela, valor: string): void {
    this.filtros.update(f => ({ ...f, [campo]: valor }));
  }

  filtrarPorGrafico(filtro: string): void {
    this.filtros.update(f => ({ ...f, statusAFaturar: filtro }));
  }

  abrirDialogInfo(venda: RvdVenda): void {
    this.dialog.open(DialogInfoComponent, {
      data: {
        venda,
        enableAFaturarPremium: this.enableAFaturarPremium(),
        lojaSelecionada: this.lojaSelecionada(),
        departamento: this.departamentoSelecionado(),
      } as DialogInfoData,
      width: '900px',
      maxHeight: '90vh',
      panelClass: 'rvd-dialog',
    }).afterClosed().subscribe(result => {
      if (result?.sucesso) this.buscarVendas();
    });
  }

  abrirDialogCadPremium(venda?: RvdVenda): void {
    this.dialog.open(DialogCadPremiumComponent, {
      data: {
        lojaSelecionada: this.lojaSelecionada(),
        departamento: this.departamentoSelecionado(),
        venda,
        isEditMode: !!venda,
      } as DialogCadPremiumData,
      width: '760px',
      maxHeight: '90vh',
      panelClass: 'rvd-dialog',
    }).afterClosed().subscribe(result => {
      if (result?.sucesso) this.buscarVendas();
    });
  }

  async excluirRegistro(venda: RvdVenda): Promise<void> {
    try {
      await this.cadastroVendasService.removeByStoreAndProposalKey(
        venda.loja_idloja,
        venda.chave_proposta_loja_dms
      );
      this.snackBar.open('Registro excluído com sucesso', undefined, { duration: 3000 });
      await this.buscarVendas();
    } catch {
      this.snackBar.open('Erro ao excluir registro', 'x', { duration: 3000 });
    }
  }

  getStatusColor(status: string | null): string {
    const cores: Record<string, string> = {
      REALIZADO: 'status-faturado',
      PENDENTE: 'status-pendente',
      DEVOLVIDO: 'status-devolvido',
    };
    return status ? (cores[status] ?? 'status-negociando') : 'status-negociando';
  }
}