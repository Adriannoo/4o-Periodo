import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmpresaService } from '../empresa.service';
import { UFS } from '../empresa.model';
import { cnpjValidator, formatarCnpj, formatarTelefone } from '../cnpj.validator';

@Component({
  selector: 'app-empresa-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './empresa-form.html',
  styleUrl: './empresa-form.scss',
})
export class EmpresaForm implements OnInit {
  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaService);
  private router = inject(Router);
  private rota = inject(ActivatedRoute);

  ufs = UFS;
  empresaId = signal<number | null>(null);
  salvando = signal(false);
  erro = signal<string | null>(null);

  formulario = this.fb.group({
    razaoSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    nomeFantasia: ['', [Validators.required, Validators.maxLength(80)]],
    cnpj: ['', [Validators.required, cnpjValidator]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
    email: ['', [Validators.required, Validators.email]],
    cidade: ['', [Validators.required]],
    uf: ['', [Validators.required]],
    ativa: [true],
  });

  get editando(): boolean {
    return this.empresaId() !== null;
  }

  ngOnInit(): void {
    const id = this.rota.snapshot.paramMap.get('id');

    if (id) {
      this.empresaId.set(Number(id));
      this.carregarEmpresa(Number(id));
    }
  }

  private carregarEmpresa(id: number): void {
    this.empresaService.buscarPorId(id).subscribe({
      next: (empresa) => this.formulario.patchValue(empresa),
      error: () => {
        this.erro.set('Empresa não encontrada.');
        this.formulario.disable();
      },
    });
  }

  aoDigitarCnpj(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.formulario.controls.cnpj.setValue(formatarCnpj(input.value));
  }

  aoDigitarTelefone(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.formulario.controls.telefone.setValue(formatarTelefone(input.value));
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
    const id = this.empresaId();

    if (this.empresaService.cnpjJaCadastrado(dados.cnpj!, id ?? undefined)) {
      this.erro.set('Já existe uma empresa cadastrada com este CNPJ.');
      return;
    }

    this.salvando.set(true);

    const requisicao = id
      ? this.empresaService.atualizar({ id, ...dados } as any)
      : this.empresaService.criar(dados as any);

    requisicao.subscribe({
      next: () => this.router.navigate(['/empresa']),
      error: () => {
        this.erro.set('Não foi possível salvar. Tente novamente.');
        this.salvando.set(false);
      },
    });
  }

  limpar(): void {
    this.formulario.reset({ ativa: true });
    this.erro.set(null);
  }
}