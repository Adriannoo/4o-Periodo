import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovimentacaoService } from '../movimentacao.service';
import { CATEGORIAS, CONTAS, FORMAS, TIPOS } from '../movimentacao.model';
import { EmpresaService } from '../../empresa/empresa.service';
import { Empresa } from '../../empresa/empresa.model';

@Component({
  selector: 'app-movimentacao-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './movimentacao-form.html',
  styleUrl: './movimentacao-form.scss',
})
export class MovimentacaoForm implements OnInit {
  private fb = inject(FormBuilder);
  private movimentacaoService = inject(MovimentacaoService);
  private empresaService = inject(EmpresaService);
  private router = inject(Router);
  private rota = inject(ActivatedRoute);

  tipos = TIPOS;
  formas = FORMAS;
  contas = CONTAS;
  categorias = CATEGORIAS;

  empresas = signal<Empresa[]>([]);
  movimentacaoId = signal<number | null>(null);
  salvando = signal(false);
  erro = signal<string | null>(null);

  formulario = this.fb.group({
    empresaId: [null as number | null, [Validators.required]],
    tipo: ['ENTRADA', [Validators.required]],
    descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    valor: [null as number | null, [Validators.required, Validators.min(0.01)]],
    data: [this.hojeIso(), [Validators.required]],
    categoria: ['', [Validators.required]],
    conta: ['', [Validators.required]],
    forma: ['PIX', [Validators.required]],
  });

  get editando(): boolean {
    return this.movimentacaoId() !== null;
  }

  ngOnInit(): void {
    this.empresaService.listar().subscribe((empresas) => {
      this.empresas.set(empresas.filter((e) => e.ativa));

      if (this.empresas().length === 0) {
        this.erro.set('Cadastre uma empresa ativa antes de lançar movimentações.');
        this.formulario.disable();
      }
    });

    const id = this.rota.snapshot.paramMap.get('id');

    if (id) {
      this.movimentacaoId.set(Number(id));
      this.carregar(Number(id));
    }
  }

  private carregar(id: number): void {
    this.movimentacaoService.buscarPorId(id).subscribe({
      next: (movimentacao) => this.formulario.patchValue(movimentacao),
      error: () => {
        this.erro.set('Movimentação não encontrada.');
        this.formulario.disable();
      },
    });
  }

  private hojeIso(): string {
    return new Date().toISOString().slice(0, 10);
  }

  invalido(campo: string): boolean {
    const controle = this.formulario.get(campo);
    return !!controle && controle.invalid && (controle.touched || controle.dirty);
  }

  erroDe(campo: string, tipo: string): boolean {
    return !!this.formulario.get(campo)?.errors?.[tipo];
  }

  salvar(): void {
    this.erro.set(null);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const dados = this.formulario.getRawValue();
    const id = this.movimentacaoId();

    /** Arredonda para duas casas: valores em reais não podem carregar fração de centavo. */
    const payload = {
      ...dados,
      valor: Math.round(Number(dados.valor) * 100) / 100,
    };

    this.salvando.set(true);

    const requisicao = id
      ? this.movimentacaoService.atualizar({ id, ...payload } as any)
      : this.movimentacaoService.criar(payload as any);

    requisicao.subscribe({
      next: () => this.router.navigate(['/movimentacao']),
      error: () => {
        this.erro.set('Não foi possível salvar. Tente novamente.');
        this.salvando.set(false);
      },
    });
  }

  limpar(): void {
    this.formulario.reset({
      tipo: 'ENTRADA',
      forma: 'PIX',
      data: this.hojeIso(),
    });
    this.erro.set(null);
  }
}