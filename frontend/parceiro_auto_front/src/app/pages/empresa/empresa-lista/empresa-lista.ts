import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmpresaService } from '../empresa.service';
import { Empresa } from '../empresa.model';

@Component({
  selector: 'app-empresa-lista',
  imports: [FormsModule, RouterLink],
  templateUrl: './empresa-lista.html',
  styleUrl: './empresa-lista.scss',
})
export class EmpresaLista implements OnInit {
  private empresaService = inject(EmpresaService);

  empresas = signal<Empresa[]>([]);
  carregando = signal(false);
  termoBusca = signal('');

  empresaParaExcluir = signal<Empresa | null>(null);

  empresasFiltradas = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();

    if (!termo) {
      return this.empresas();
    }

    return this.empresas().filter(
      (e) =>
        e.razaoSocial.toLowerCase().includes(termo) ||
        e.nomeFantasia.toLowerCase().includes(termo) ||
        e.cnpj.includes(termo),
    );
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);

    this.empresaService.listar().subscribe({
      next: (empresas) => {
        this.empresas.set(empresas);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  abrirConfirmacao(empresa: Empresa): void {
    this.empresaParaExcluir.set(empresa);
  }

  fecharConfirmacao(): void {
    this.empresaParaExcluir.set(null);
  }

  confirmarExclusao(): void {
    const empresa = this.empresaParaExcluir();

    if (!empresa) {
      return;
    }

    this.empresaService.excluir(empresa.id).subscribe(() => {
      this.fecharConfirmacao();
      this.carregar();
    });
  }
}