import { Component, Inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import type { RvdVenda, HistoricoModificacao, AFaturarPremium } from '../../../interfaces/rvd-venda.interface';

export interface DialogInfoData {
  venda: RvdVenda;
  enableAFaturarPremium: boolean;
  lojaSelecionada: any;
  departamento: string;
}

@Component({
  selector: 'app-dialog-info',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.scss'],
})
export class DialogInfoComponent implements OnInit {
  historicoFiltrado = signal<HistoricoModificacao[]>([]);
  dadosPremium = signal<AFaturarPremium | null>(null);
  abaAtiva = signal(0);

  colunasDetalhes = ['dtaAbertura', 'modelo', 'vendedor', 'diasAteFaturar', 'nfNo', 'valorNf', 'valorFabrica'];
  colunasHistorico = ['data', 'usuario', 'valor_sinal', 'banco', 'bonus', 'outros_bonus', 'brinde', 'seguro', 'tabela', 'consorcio', 'despachante', 'acessorios_nf', 'valor_financiado', 'veiculo_capturado', 'correcao_faturamento'];
  colunasPremium = ['dta_venda', 'dta_nf', 'tipo_veiculo', 'dta_entrada_estoque', 'nf_nro', 'pedido', 'modelo', 'tipo_venda', 'local_venda', 'valor_nota_venda', 'valor_nf_fabrica', 'acoes'];

  get venda(): RvdVenda {
    return this.data.venda;
  }

  get maisInfo() {
    return this.data.venda.maisInformacoes;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogInfoData,
    private dialogRef: MatDialogRef<DialogInfoComponent>,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.dadosPremium.set(this.venda.a_faturar_premium ?? null);
    this.processarHistorico();
  }

  private processarHistorico(): void {
    const historico = this.venda.historico ?? [];
    if (historico.length <= 1) {
      this.historicoFiltrado.set(historico);
      return;
    }

    const filtrado = historico.filter((entry, index) => {
      if (index === 0) return true;
      const anterior = historico[index - 1];
      return JSON.stringify(entry.descricao) !== JSON.stringify(anterior.descricao);
    });

    this.historicoFiltrado.set(filtrado);
  }

  isModificado(entry: HistoricoModificacao, campo: keyof HistoricoModificacao['descricao']): boolean {
    const historico = this.historicoFiltrado();
    const index = historico.indexOf(entry);
    if (index === 0) return false;
    return historico[index - 1].descricao[campo] !== entry.descricao[campo];
  }

  getStatusClass(): string {
    const status = this.venda.status_a_faturar;
    if (status === 'REALIZADO') return 'badge--faturado';
    if (status === 'PENDENTE') return 'badge--pendente';
    if (status === 'DEVOLVIDO') return 'badge--devolvido';
    return 'badge--negociando';
  }

  getStatusLabel(): string {
    const status = this.venda.status_a_faturar;
    if (status === 'REALIZADO') return 'Faturado';
    if (status === 'PENDENTE') return 'A Faturar';
    if (status === 'DEVOLVIDO') return 'Devolvido';
    return 'Negociando';
  }

  abrirEdicaoPremium(): void {
    // será implementado após criar o dialog-cad-premium
  }

  fechar(): void {
    this.dialogRef.close();
  }
}