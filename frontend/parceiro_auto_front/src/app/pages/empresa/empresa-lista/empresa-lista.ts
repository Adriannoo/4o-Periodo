import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmpresaService } from '../empresa.service';
import {
  Empresa,
  REGIMES,
  RegimeTributario,
  rotuloPorte,
  rotuloRegime,
} from '../empresa.model';

type Coluna = 'razaoSocial' | 'cnpj' | 'regime' | 'porte' | 'cidade';
type Direcao = 'asc' | 'desc';

@Component({
  selector: 'app-empresa-lista',
  imports: [FormsModule, RouterLink],
  templateUrl: './empresa-lista.html',
  styleUrl: './empresa-lista.scss',
})
export class EmpresaLista implements OnInit {
  private empresaService = inject(EmpresaService);

  regimes = REGIMES;

  empresas = signal<Empresa[]>([]);
  carregando = signal(false);

  termoBusca = signal('');
  regime = signal<RegimeTributario | 'todos'>('todos');
  situacao = signal<'todas' | 'ativas' | 'inativas'>('todas');

  colunaOrdenada = signal<Coluna>('razaoSocial');
  direcao = signal<Direcao>('asc');

  empresaParaExcluir = signal<Empresa | null>(null);

  filtradas = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    const filtroRegime = this.regime();
    const filtroSituacao = this.situacao();
    const coluna = this.colunaOrdenada();
    const sentido = this.direcao() === 'asc' ? 1 : -1;

    const lista = this.empresas()
      .filter((e) => filtroRegime === 'todos' || e.regime === filtroRegime)
      .filter((e) =>
        filtroSituacao === 'todas' ? true : e.ativa === (filtroSituacao === 'ativas'),
      )
      .filter(
        (e) =>
          !termo ||
          e.razaoSocial.toLowerCase().includes(termo) ||
          e.nomeFantasia.toLowerCase().includes(termo) ||
          e.cnpj.includes(termo),
      );

    return [...lista].sort(
      (a, b) => String(a[coluna]).localeCompare(String(b[coluna]), 'pt-BR') * sentido,
    );
  });

  totalAtivas = computed(() => this.empresas().filter((e) => e.ativa).length);

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

  regimeLegivel(e: Empresa): string {
    return rotuloRegime(e.regime);
  }

  porteLegivel(e: Empresa): string {
    return rotuloPorte(e.porte);
  }

  temFiltro(): boolean {
    return this.termoBusca() !== '' || this.regime() !== 'todos' || this.situacao() !== 'todas';
  }

  limparFiltros(): void {
    this.termoBusca.set('');
    this.regime.set('todos');
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