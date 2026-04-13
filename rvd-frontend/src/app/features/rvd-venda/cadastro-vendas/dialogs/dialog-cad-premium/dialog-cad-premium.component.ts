import { Component, Inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { format, parse, isValid } from 'date-fns';
import { CadastroVendasService } from '../../cadastro-vendas.service';
import type { RvdVenda, AFaturarPremium } from '../../../interfaces/rvd-venda.interface';

export interface DialogCadPremiumData {
  lojaSelecionada: any;
  departamento: string;
  venda?: RvdVenda;
  isEditMode?: boolean;
}

@Component({
  selector: 'app-dialog-cad-premium',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
  templateUrl: './dialog-cad-premium.component.html',
  styleUrls: ['./dialog-cad-premium.component.scss'],
})
export class DialogCadPremiumComponent implements OnInit {
  form: FormGroup;
  vendedores = signal<any[]>([]);
  carregando = signal(false);
  salvando = signal(false);

  get isEditMode(): boolean {
    return !!this.data.isEditMode;
  }

  formularioValido = computed(() => {
    return this.form?.valid && this.vendedores().length >= 0;
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogCadPremiumData,
    private dialogRef: MatDialogRef<DialogCadPremiumComponent>,
    private fb: FormBuilder,
    private cadastroVendasService: CadastroVendasService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      chassi: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      vendedor: [null, Validators.required],
      dta_venda: ['', Validators.required],
      dta_nf: [''],
      dta_entrada_estoque: [''],
      tipo_veiculo: ['CARRO', Validators.required],
      pedido: ['', Validators.required],
      cliente: ['', Validators.required],
      modelo: ['', Validators.required],
      tipo_venda: [''],
      local_venda: [''],
      valor_nota_venda: [null, [Validators.required, Validators.min(0.01)]],
      valor_nf_fabrica: [null],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.carregarVendedores();

    if (this.isEditMode && this.data.venda) {
      this.preencherFormulario();
    }

    this.form.get('chassi')?.valueChanges.subscribe(value => {
      if (value?.length === 17) {
        const pedido = value.replace(/\D/g, '').slice(-6);
        this.form.get('pedido')?.setValue(pedido, { emitEvent: false });
      }
    });
  }

  private async carregarVendedores(): Promise<void> {
    this.carregando.set(true);
    try {
      const integracao = this.data.lojaSelecionada?.rvdVendas?.find(
        (i: any) => i.departamento_iddepartamento === this.data.departamento
      );
      if (integracao) {
        const vendedores = await this.cadastroVendasService.getVendedoresBI(integracao);
        this.vendedores.set(vendedores ?? []);
      }
    } catch {
      this.snackBar.open('Erro ao carregar vendedores', 'x', { duration: 3000 });
    } finally {
      this.carregando.set(false);
    }
  }

  private preencherFormulario(): void {
    const venda = this.data.venda!;
    const premium = venda.a_faturar_premium;

    this.form.patchValue({
      chassi: venda.chassi,
      dta_venda: premium?.dta_venda ? this.formatDateForInput(premium.dta_venda) : '',
      dta_nf: premium?.dta_nf ? this.formatDateForInput(premium.dta_nf) : '',
      dta_entrada_estoque: premium?.dta_entrada_estoque
        ? this.formatDateForInput(premium.dta_entrada_estoque) : '',
      tipo_veiculo: premium?.tipo_veiculo ?? 'CARRO',
      pedido: premium?.pedido ?? '',
      cliente: premium?.cliente ?? '',
      modelo: premium?.modelo ?? '',
      tipo_venda: premium?.tipo_venda ?? '',
      local_venda: premium?.local_venda ?? '',
      valor_nota_venda: premium?.valor_nota_venda ?? null,
      valor_nf_fabrica: premium?.valor_nf_fabrica ?? null,
    });

    const vendedor = this.vendedores().find(v => v.nome === venda.nome_usuario_dms);
    if (vendedor) {
      this.form.get('vendedor')?.setValue(vendedor);
    }
  }

  private formatDateForInput(date: string): string {
    if (!date) return '';
    const parsed = parse(date, 'dd/MM/yyyy', new Date());
    return isValid(parsed) ? format(parsed, 'yyyy-MM-dd') : '';
  }

  private formatDateForSave(date: string): string {
    if (!date) return '';
    const parsed = new Date(date);
    return isValid(parsed) ? format(parsed, 'dd/MM/yyyy') : '';
  }

  getFieldError(campo: string): string {
    const control = this.form.get(campo);
    if (!control?.invalid || !control?.touched) return '';
    if (control.errors?.['required']) return 'Campo obrigatório';
    if (control.errors?.['minlength']) return 'Mínimo 17 caracteres';
    if (control.errors?.['min']) return 'Valor deve ser maior que zero';
    return 'Campo inválido';
  }

  isFieldValid(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control?.valid && !!control?.value;
  }

  isFieldInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control?.invalid && !!control?.touched;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    const values = this.form.value;
    const vendedor = values.vendedor;

    const premiumData: AFaturarPremium = {
      dta_venda: this.formatDateForSave(values.dta_venda),
      dta_nf: this.formatDateForSave(values.dta_nf),
      tipo_veiculo: values.tipo_veiculo,
      dta_entrada_estoque: this.formatDateForSave(values.dta_entrada_estoque),
      venda_nro: null,
      nf_nro: null,
      pedido: values.pedido,
      cliente: values.cliente,
      modelo: values.modelo,
      tipo_venda: values.tipo_venda,
      local_venda: values.local_venda,
      valor_nota_venda: Number(values.valor_nota_venda),
      valor_nf_fabrica: values.valor_nf_fabrica ? Number(values.valor_nf_fabrica) : null,
    };

    const payload: any = {
      loja_idloja: this.data.lojaSelecionada.idloja,
      departamento_iddepartamento: this.data.departamento,
      chassi: values.chassi,
      nro_proposta: Number(values.pedido),
      chave_proposta_loja_dms: values.chassi,
      status_a_faturar: 'PENDENTE',
      id_usuario_dms: vendedor?.idVendedor,
      nome_usuario_dms: vendedor?.nome,
      cpf_usuario_dms: vendedor?.cpfUsuario,
      departamento_usuario_dms: vendedor?.departamentoUsuarioDms,
      time_venda_dms: vendedor?.timeVendaDms,
      nome_time_venda_dms: vendedor?.nomeTimeVendaDms,
      empresa_origem_proposta: vendedor?.empresa,
      revenda_origem_proposta: vendedor?.revenda,
      devolucao: false,
      a_faturar_premium: premiumData,
    };

    try {
      if (this.isEditMode && this.data.venda) {
        const rvdVendaManual = {
          loja_idloja: this.data.venda.loja_idloja,
          departamento_iddepartamento: this.data.venda.departamento_iddepartamento,
          nro_proposta: this.data.venda.nro_proposta!,
          chave_proposta_loja_dms: this.data.venda.chave_proposta_loja_dms,
          devolucao: this.data.venda.devolucao,
        };
        await this.cadastroVendasService.updateVendaManual(rvdVendaManual, payload);
        this.snackBar.open('Registro atualizado com sucesso', undefined, { duration: 3000 });
      } else {
        await this.cadastroVendasService.createManualInsert(payload);
        this.snackBar.open('Venda cadastrada com sucesso', undefined, { duration: 3000 });
      }
      this.dialogRef.close({ sucesso: true });
    } catch (error: any) {
      const msg = error?.error?.message ?? 'Erro ao salvar registro';
      this.snackBar.open(msg, 'x', { duration: 4000 });
    } finally {
      this.salvando.set(false);
    }
  }

  fechar(): void {
    this.dialogRef.close({ cancelado: true });
  }
}