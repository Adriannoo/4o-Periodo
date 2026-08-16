import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmpresaService } from '../empresa.service';
import { Empresa } from '../empresa.model';

type Coluna = 'razaoSocial' | 'nomeFantasia' | 'cnpj' | 'cidade' | 'ativa';
type Direcao = 'asc' | 'desc';
type FiltroSituacao = 'todas' | 'ativas' | 'inativas';

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
  situacao = signal<FiltroSituacao>('todas');

  colunaOrdenada = signal<Coluna>('razaoSocial');
  direcao = signal<Direcao>('asc');

  empresaParaExcluir = signal<Empresa | null>(null);

  empresasFiltradas = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    const filtro = this.situacao();
    const coluna = this.colunaOrdenada();
    const sentido = this.direcao() === 'asc' ? 1 : -1;

    let lista = this.empresas();

    if (filtro !== 'todas') {
      const querAtivas = filtro === 'ativas';
      lista = lista.filter((e) => e.ativa === querAtivas);
    }

    if (termo) {
      lista = lista.filter(
        (e) =>
          e.razaoSocial.toLowerCase().includes(termo) ||
          e.nomeFantasia.toLowerCase().includes(termo) ||
          e.cnpj.includes(termo),
      );
    }

    return [...lista].sort((a, b) => {
      const valorA = a[coluna];
      const valorB = b[coluna];

      if (typeof valorA === 'boolean' && typeof valorB === 'boolean') {
        return (Number(valorA) - Number(valorB)) * sentido;
      }

      return String(valorA).localeCompare(String(valorB), 'pt-BR') * sentido;
    });
  });

  totalAtivas = computed(() => this.empresas().filter((e) => e.ativa).length);
  totalInativas = computed(() => this.empresas().length - this.totalAtivas());

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

  ordenarPor(coluna: Coluna): void {
    if (this.colunaOrdenada() === coluna) {
      this.direcao.set(this.direcao() === 'asc' ? 'desc' : 'asc');
      return;
    }

    this.colunaOrdenada.set(coluna);
    this.direcao.set('asc');
  }

  seta(coluna: Coluna): string {
    if (this.colunaOrdenada() !== coluna) {
      return '';
    }

    return this.direcao() === 'asc' ? '▲' : '▼';
  }

  limparFiltros(): void {
    this.termoBusca.set('');
    this.situacao.set('todas');
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