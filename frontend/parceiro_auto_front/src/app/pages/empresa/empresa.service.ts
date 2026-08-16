import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Empresa } from './empresa.model';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private empresas: Empresa[] = [
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

  private proximoId = 3;

  private readonly LATENCIA = 300;

  listar(): Observable<Empresa[]> {
    return of(this.empresas.map((e) => ({ ...e }))).pipe(delay(this.LATENCIA));
  }

  buscarPorId(id: number): Observable<Empresa> {
    const empresa = this.empresas.find((e) => e.id === id);

    if (!empresa) {
      return throwError(() => new Error(`Empresa ${id} não encontrada.`));
    }

    return of({ ...empresa }).pipe(delay(this.LATENCIA));
  }

  criar(dados: Omit<Empresa, 'id'>): Observable<Empresa> {
    const nova: Empresa = { ...dados, id: this.proximoId++ };
    this.empresas.push(nova);

    return of({ ...nova }).pipe(delay(this.LATENCIA));
  }

  atualizar(empresa: Empresa): Observable<Empresa> {
    const indice = this.empresas.findIndex((e) => e.id === empresa.id);

    if (indice === -1) {
      return throwError(() => new Error(`Empresa ${empresa.id} não encontrada.`));
    }

    this.empresas[indice] = { ...empresa };

    return of({ ...empresa }).pipe(delay(this.LATENCIA));
  }

  excluir(id: number): Observable<void> {
    this.empresas = this.empresas.filter((e) => e.id !== id);

    return of(void 0).pipe(delay(this.LATENCIA));
  }

  cnpjJaCadastrado(cnpj: string, idIgnorado?: number): boolean {
    const limpo = cnpj.replace(/\D/g, '');

    return this.empresas.some(
      (e) => e.cnpj.replace(/\D/g, '') === limpo && e.id !== idIgnorado,
    );
  }
}