import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Empresa } from './empresa.model';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private readonly CHAVE = 'parceiro-auto:empresas';

  private readonly LATENCIA = 300;

  private readonly SEMENTE: Empresa[] = [
    {
      id: 1,
      razaoSocial: 'Auto Peças Iguaçu LTDA',
      nomeFantasia: 'Iguaçu Peças',
      cnpj: '12.345.678/0001-95',
      telefone: '(45) 3521-1000',
      email: 'contato@iguacupecas.com.br',
      cidade: 'Foz do Iguaçu',
      uf: 'PR',
      ativa: true,
    },
    {
      id: 2,
      razaoSocial: 'Oficina Mecânica Central S/A',
      nomeFantasia: 'Central Motors',
      cnpj: '11.222.333/0001-81',
      telefone: '(41) 3030-2200',
      email: 'sac@centralmotors.com.br',
      cidade: 'Curitiba',
      uf: 'PR',
      ativa: false,
    },
  ];

  constructor() {
    if (localStorage.getItem(this.CHAVE) === null) {
      this.gravar(this.SEMENTE);
    }
  }

  private ler(): Empresa[] {
    try {
      const bruto = localStorage.getItem(this.CHAVE);
      return bruto ? (JSON.parse(bruto) as Empresa[]) : [];
    } catch {
      this.gravar(this.SEMENTE);
      return [...this.SEMENTE];
    }
  }

  private gravar(empresas: Empresa[]): void {
    localStorage.setItem(this.CHAVE, JSON.stringify(empresas));
  }

  private gerarId(empresas: Empresa[]): number {
    return empresas.reduce((maior, e) => Math.max(maior, e.id), 0) + 1;
  }

  listar(): Observable<Empresa[]> {
    return of(this.ler()).pipe(delay(this.LATENCIA));
  }

  buscarPorId(id: number): Observable<Empresa> {
    const empresa = this.ler().find((e) => e.id === id);

    if (!empresa) {
      return throwError(() => new Error(`Empresa ${id} não encontrada.`));
    }

    return of(empresa).pipe(delay(this.LATENCIA));
  }

  criar(dados: Omit<Empresa, 'id'>): Observable<Empresa> {
    const empresas = this.ler();
    const nova: Empresa = { ...dados, id: this.gerarId(empresas) };

    empresas.push(nova);
    this.gravar(empresas);

    return of(nova).pipe(delay(this.LATENCIA));
  }

  atualizar(empresa: Empresa): Observable<Empresa> {
    const empresas = this.ler();
    const indice = empresas.findIndex((e) => e.id === empresa.id);

    if (indice === -1) {
      return throwError(() => new Error(`Empresa ${empresa.id} não encontrada.`));
    }

    empresas[indice] = { ...empresa };
    this.gravar(empresas);

    return of(empresa).pipe(delay(this.LATENCIA));
  }

  excluir(id: number): Observable<void> {
    this.gravar(this.ler().filter((e) => e.id !== id));

    return of(void 0).pipe(delay(this.LATENCIA));
  }

  cnpjJaCadastrado(cnpj: string, idIgnorado?: number): boolean {
    const limpo = cnpj.replace(/\D/g, '');

    return this.ler().some(
      (e) => e.cnpj.replace(/\D/g, '') === limpo && e.id !== idIgnorado,
    );
  }

  restaurarExemplos(): void {
    this.gravar(this.SEMENTE);
  }
}