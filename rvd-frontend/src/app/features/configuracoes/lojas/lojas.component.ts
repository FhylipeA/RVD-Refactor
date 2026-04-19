import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LojasService, Loja, RvdVendaConfig } from './lojas.service';

@Component({
  selector: 'app-lojas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSlideToggleModule,
  ],
  templateUrl: './lojas.component.html',
  styleUrls: ['./lojas.component.scss'],
})
export class LojasComponent implements OnInit {
  private readonly lojasService = inject(LojasService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  lojas = signal<Loja[]>([]);
  carregando = signal(false);
  mostrarFormLoja = signal(false);
  lojaEditando = signal<Loja | null>(null);
  mostrarFormDep = signal<number | null>(null);
  depEditando = signal<{ lojaId: number; dep: RvdVendaConfig } | null>(null);

  readonly LEGADOS = ['NBS', 'LINX', 'APOLLO', 'OUTRO'];
  readonly BANDEIRAS = [
    { id: 12, nome: 'GM' },
    { id: 13, nome: 'HYUNDAI' },
    { id: 17, nome: 'NBS' },
    { id: 18, nome: 'NBS2' },
    { id: 21, nome: 'VOLVO' },
    { id: 22, nome: 'AUDI' },
  ];

  formLoja: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    dePara_LinxDms: ['', Validators.required],
    bandeira_idbandeira: [null],
  });

  formDep: FormGroup = this.fb.group({
    departamento_iddepartamento: ['', [Validators.required, Validators.maxLength(2)]],
    descricao_departamento: ['', Validators.required],
    legado: ['NBS', Validators.required],
    loja_nome_bandeira: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.carregarLojas();
  }

  async carregarLojas(): Promise<void> {
    this.carregando.set(true);
    try {
      const lojas = await this.lojasService.getAll();
      this.lojas.set(lojas);
    } catch {
      this.snackBar.open('Erro ao carregar lojas', 'x', { duration: 3000 });
    } finally {
      this.carregando.set(false);
    }
  }

  abrirFormLoja(loja?: Loja): void {
    this.lojaEditando.set(loja ?? null);
    this.mostrarFormDep.set(null);
    if (loja) {
      this.formLoja.patchValue({
        nome: loja.nome,
        dePara_LinxDms: loja.dePara_LinxDms,
        bandeira_idbandeira: loja.bandeira_idbandeira,
      });
    } else {
      this.formLoja.reset();
    }
    this.mostrarFormLoja.set(true);
  }

  cancelarFormLoja(): void {
    this.mostrarFormLoja.set(false);
    this.lojaEditando.set(null);
    this.formLoja.reset();
  }

  async salvarLoja(): Promise<void> {
    if (this.formLoja.invalid) {
      this.formLoja.markAllAsTouched();
      return;
    }
    try {
      const payload = this.formLoja.value;
      if (this.lojaEditando()) {
        await this.lojasService.update(this.lojaEditando()!.idloja, payload);
        this.snackBar.open('Loja atualizada', undefined, { duration: 3000 });
      } else {
        await this.lojasService.create(payload);
        this.snackBar.open('Loja criada', undefined, { duration: 3000 });
      }
      this.cancelarFormLoja();
      await this.carregarLojas();
    } catch {
      this.snackBar.open('Erro ao salvar loja', 'x', { duration: 3000 });
    }
  }

  async removerLoja(loja: Loja): Promise<void> {
    if (!confirm(`Deseja remover a loja "${loja.nome}"?`)) return;
    try {
      await this.lojasService.remove(loja.idloja);
      this.snackBar.open('Loja removida', undefined, { duration: 3000 });
      await this.carregarLojas();
    } catch {
      this.snackBar.open('Erro ao remover loja', 'x', { duration: 3000 });
    }
  }

  abrirFormDep(lojaId: number, dep?: RvdVendaConfig): void {
    this.mostrarFormLoja.set(false);
    this.depEditando.set(dep ? { lojaId, dep } : null);
    if (dep) {
      this.formDep.patchValue({
        departamento_iddepartamento: dep.departamento_iddepartamento,
        descricao_departamento: dep.descricao_departamento,
        legado: dep.legado,
        loja_nome_bandeira: dep.loja_nome_bandeira,
      });
    } else {
      this.formDep.reset({ legado: 'NBS' });
    }
    this.mostrarFormDep.set(lojaId);
  }

  cancelarFormDep(): void {
    this.mostrarFormDep.set(null);
    this.depEditando.set(null);
    this.formDep.reset({ legado: 'NBS' });
  }

  async salvarDep(): Promise<void> {
    if (this.formDep.invalid) {
      this.formDep.markAllAsTouched();
      return;
    }
    const lojaId = this.mostrarFormDep()!;
    const payload = this.formDep.value;
    try {
      if (this.depEditando()) {
        await this.lojasService.updateDepartamento(
          lojaId,
          this.depEditando()!.dep.id,
          payload,
        );
        this.snackBar.open('Departamento atualizado', undefined, { duration: 3000 });
      } else {
        await this.lojasService.addDepartamento(lojaId, payload);
        this.snackBar.open('Departamento adicionado', undefined, { duration: 3000 });
      }
      this.cancelarFormDep();
      await this.carregarLojas();
    } catch {
      this.snackBar.open('Erro ao salvar departamento', 'x', { duration: 3000 });
    }
  }

  async removerDep(lojaId: number, dep: RvdVendaConfig): Promise<void> {
    if (!confirm(`Deseja remover o departamento "${dep.descricao_departamento}"?`)) return;
    try {
      await this.lojasService.removeDepartamento(lojaId, dep.id);
      this.snackBar.open('Departamento removido', undefined, { duration: 3000 });
      await this.carregarLojas();
    } catch {
      this.snackBar.open('Erro ao remover departamento', 'x', { duration: 3000 });
    }
  }

  getBandeiraNome(id: number | null): string {
    return this.BANDEIRAS.find(b => b.id === id)?.nome ?? '—';
  }
}