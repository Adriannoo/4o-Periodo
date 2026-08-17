import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EmpresaService } from '../empresa/empresa.service';
import { Empresa } from '../empresa/empresa.model';
import { MovimentacaoService } from '../movimentacao/movimentacao.service';
import { Movimentacao } from '../movimentacao/movimentacao.model';

interface BarraMes {
  rotulo: string;
  entradas: number;
  saidas: number;
  alturaEntrada: number;
  alturaSaida: number;
}

interface FatiaCategoria {
  rotulo: string;
  total: number;
  percentual: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private empresaService = inject(EmpresaService);
  private movimentacaoService = inject(MovimentacaoService);

  empresas = signal<Empresa[]>([]);
  todas = signal<Movimentacao[]>([]);
  carregando = signal(false);

  empresaId = signal<number | 'todas'>('todas');

  hoje = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  /** Competência atual no formato AAAA-MM, usada para recortar o mês. */
  private mesAtual = new Date().toISOString().slice(0, 7);

  movimentacoes = computed(() => {
    const filtro = this.empresaId();
    return filtro === 'todas'
      ? this.todas()
      : this.todas().filter((m) => m.empresaId === filtro);
  });

  doMes = computed(() =>
    this.movimentacoes().filter((m) => m.data.startsWith(this.mesAtual)),
  );

  receitaMes = computed(() => this.somar(this.doMes(), 'ENTRADA'));
  despesaMes = computed(() => this.somar(this.doMes(), 'SAIDA'));
  resultadoMes = computed(() => this.receitaMes() - this.despesaMes());

  saldoAcumulado = computed(
    () => this.somar(this.movimentacoes(), 'ENTRADA') - this.somar(this.movimentacoes(), 'SAIDA'),
  );

  ticketMedio = computed(() => {
    const entradas = this.doMes().filter((m) => m.tipo === 'ENTRADA');
    return entradas.length === 0 ? 0 : this.receitaMes() / entradas.length;
  });

  /** Últimos seis meses, com as barras já normalizadas pelo maior valor do período. */
  evolucao = computed<BarraMes[]>(() => {
    const meses: { chave: string; rotulo: string }[] = [];
    const referencia = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(referencia.getFullYear(), referencia.getMonth() - i, 1);
      meses.push({
        chave: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        rotulo: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
      });
    }

    const bruto = meses.map(({ chave, rotulo }) => {
      const doPeriodo = this.movimentacoes().filter((m) => m.data.startsWith(chave));
      return {
        rotulo,
        entradas: this.somar(doPeriodo, 'ENTRADA'),
        saidas: this.somar(doPeriodo, 'SAIDA'),
      };
    });

    const teto = Math.max(...bruto.flatMap((b) => [b.entradas, b.saidas]), 1);

    return bruto.map((b) => ({
      ...b,
      alturaEntrada: Math.round((b.entradas / teto) * 100),
      alturaSaida: Math.round((b.saidas / teto) * 100),
    }));
  });

  despesasPorCategoria = computed<FatiaCategoria[]>(() => {
    const saidas = this.doMes().filter((m) => m.tipo === 'SAIDA');
    const total = saidas.reduce((soma, m) => soma + m.valor, 0);
    const contagem = new Map<string, number>();

    for (const m of saidas) {
      contagem.set(m.categoria, (contagem.get(m.categoria) ?? 0) + m.valor);
    }

    return [...contagem.entries()]
      .map(([rotulo, valor]) => ({
        rotulo,
        total: valor,
        percentual: total === 0 ? 0 : Math.round((valor / total) * 100),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  });

  recentes = computed(() =>
    [...this.movimentacoes()]
      .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id)
      .slice(0, 5),
  );

  ngOnInit(): void {
    this.carregando.set(true);

    forkJoin({
      empresas: this.empresaService.listar(),
      movimentacoes: this.movimentacaoService.listar(),
    }).subscribe({
      next: ({ empresas, movimentacoes }) => {
        this.empresas.set(empresas);
        this.todas.set(movimentacoes);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  private somar(lista: Movimentacao[], tipo: 'ENTRADA' | 'SAIDA'): number {
    return lista.filter((m) => m.tipo === tipo).reduce((soma, m) => soma + m.valor, 0);
  }

  nomeEmpresa(id: number): string {
    return this.empresas().find((e) => e.id === id)?.nomeFantasia ?? 'Empresa removida';
  }

  moeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  data(iso: string): string {
    const [, mes, dia] = iso.split('-');
    return `${dia}/${mes}`;
  }
}
