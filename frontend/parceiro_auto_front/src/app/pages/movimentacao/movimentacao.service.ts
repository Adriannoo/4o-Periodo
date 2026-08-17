import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Movimentacao } from './movimentacao.model';

@Injectable({ providedIn: 'root' })
export class MovimentacaoService {
  private readonly CHAVE = 'parceiro-auto:movimentacoes';
  private readonly LATENCIA = 300;

  private readonly SEMENTE: Movimentacao[] = [
    {
      id: 1,
      empresaId: 1,
      conta: 'Conta Corrente',
      categoria: 'Vendas',
      tipo: 'ENTRADA',
      descricao: 'Venda de peças ao cliente Souza',
      valor: 4850,
      data: '2026-08-03',
      forma: 'PIX',
    },
    {
      id: 2,
      empresaId: 1,
      conta: 'Conta Corrente',
      categoria: 'Fornecedores',
      tipo: 'SAIDA',
      descricao: 'Compra de estoque - distribuidora Bosch',
      valor: 2310.5,
      data: '2026-08-05',
      forma: 'BOLETO',
    },
    {
      id: 3,
      empresaId: 1,
      conta: 'Conta Corrente',
      categoria: 'Salários',
      tipo: 'SAIDA',
      descricao: 'Folha de pagamento de julho',
      valor: 8200,
      data: '2026-08-05',
      forma: 'TRANSFERENCIA',
    },
    {
      id: 4,
      empresaId: 2,
      conta: 'Caixa',
      categoria: 'Serviços',
      tipo: 'ENTRADA',
      descricao: 'Revisão completa - frota Martins',
      valor: 3120,
      data: '2026-08-08',
      forma: 'CARTAO_CREDITO',
    },
    {
      id: 5,
      empresaId: 1,
      conta: 'Conta Corrente',
      categoria: 'Aluguel',
      tipo: 'SAIDA',
      descricao: 'Aluguel do galpão',
      valor: 4500,
      data: '2026-08-10',
      forma: 'PIX',
    },
    {
      id: 6,
      empresaId: 2,
      conta: 'Conta Corrente',
      categoria: 'Vendas',
      tipo: 'ENTRADA',
      descricao: 'Venda balcão - lote de filtros',
      valor: 1980.75,
      data: '2026-08-12',
      forma: 'DINHEIRO',
    },
  ];

  constructor() {
    if (localStorage.getItem(this.CHAVE) === null) {
      this.gravar(this.SEMENTE);
    }
  }

  private ler(): Movimentacao[] {
    try {
      const bruto = localStorage.getItem(this.CHAVE);
      return bruto ? (JSON.parse(bruto) as Movimentacao[]) : [];
    } catch {
      this.gravar(this.SEMENTE);
      return [...this.SEMENTE];
    }
  }

  private gravar(movimentacoes: Movimentacao[]): void {
    localStorage.setItem(this.CHAVE, JSON.stringify(movimentacoes));
  }

  private gerarId(movimentacoes: Movimentacao[]): number {
    return movimentacoes.reduce((maior, m) => Math.max(maior, m.id), 0) + 1;
  }

  listar(): Observable<Movimentacao[]> {
    return of(this.ler()).pipe(delay(this.LATENCIA));
  }

  buscarPorId(id: number): Observable<Movimentacao> {
    const movimentacao = this.ler().find((m) => m.id === id);

    if (!movimentacao) {
      return throwError(() => new Error(`Movimentação ${id} não encontrada.`));
    }

    return of(movimentacao).pipe(delay(this.LATENCIA));
  }

  criar(dados: Omit<Movimentacao, 'id'>): Observable<Movimentacao> {
    const movimentacoes = this.ler();
    const nova: Movimentacao = { ...dados, id: this.gerarId(movimentacoes) };

    movimentacoes.push(nova);
    this.gravar(movimentacoes);

    return of(nova).pipe(delay(this.LATENCIA));
  }

  atualizar(movimentacao: Movimentacao): Observable<Movimentacao> {
    const movimentacoes = this.ler();
    const indice = movimentacoes.findIndex((m) => m.id === movimentacao.id);

    if (indice === -1) {
      return throwError(() => new Error(`Movimentação ${movimentacao.id} não encontrada.`));
    }

    movimentacoes[indice] = { ...movimentacao };
    this.gravar(movimentacoes);

    return of(movimentacao).pipe(delay(this.LATENCIA));
  }

  excluir(id: number): Observable<void> {
    this.gravar(this.ler().filter((m) => m.id !== id));

    return of(void 0).pipe(delay(this.LATENCIA));
  }

  /** Usado antes de excluir uma empresa, para não deixar movimentação órfã. */
  possuiMovimentacoes(empresaId: number): boolean {
    return this.ler().some((m) => m.empresaId === empresaId);
  }

  restaurarExemplos(): void {
    this.gravar(this.SEMENTE);
  }
}