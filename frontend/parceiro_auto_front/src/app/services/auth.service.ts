import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly CHAVE_USUARIOS = 'parceiro-auto:usuarios:v1';
  private readonly CHAVE_LOGADO = 'parceiro-auto:logado:v1';
  private readonly LATENCIA = 300;

  private readonly USUARIOS_SEMENTE: Usuario[] = [
    {
      id: 1,
      nome: 'Gustavo Mendes',
      email: 'gustavo@empresa.com',
      senha: '123456',
      papel: 'admin',
      empresasId: [1, 2],
      ativo: true,
    },
    {
      id: 2,
      nome: 'Maria Silva',
      email: 'maria@empresa.com',
      senha: '123456',
      papel: 'usuario',
      empresasId: [1],
      ativo: true,
    },
    {
      id: 3,
      nome: 'João Santos',
      email: 'joao@empresa.com',
      senha: '123456',
      papel: 'usuario',
      empresasId: [2, 3],
      ativo: true,
    },
  ];

  constructor() {
    if (localStorage.getItem(this.CHAVE_USUARIOS) === null) {
      this.gravarUsuarios(this.USUARIOS_SEMENTE);
    }
  }

  private lerUsuarios(): Usuario[] {
    try {
      const bruto = localStorage.getItem(this.CHAVE_USUARIOS);
      return bruto ? (JSON.parse(bruto) as Usuario[]) : [];
    } catch {
      this.gravarUsuarios(this.USUARIOS_SEMENTE);
      return [...this.USUARIOS_SEMENTE];
    }
  }

  private gravarUsuarios(usuarios: Usuario[]): void {
    localStorage.setItem(this.CHAVE_USUARIOS, JSON.stringify(usuarios));
  }

  private lerLogado(): Usuario | null {
    try {
      const bruto = localStorage.getItem(this.CHAVE_LOGADO);
      return bruto ? (JSON.parse(bruto) as Usuario) : null;
    } catch {
      return null;
    }
  }

  private gravarLogado(usuario: Usuario | null): void {
    if (usuario === null) {
      localStorage.removeItem(this.CHAVE_LOGADO);
    } else {
      localStorage.setItem(this.CHAVE_LOGADO, JSON.stringify(usuario));
    }
  }

  login(email: string, senha: string): Observable<Usuario> {
    const usuario = this.lerUsuarios().find(
      (u) => u.email === email && u.senha === senha && u.ativo
    );

    if (!usuario) {
      return throwError(() => new Error('Email ou senha inválidos'));
    }

    this.gravarLogado(usuario);

    return of(usuario).pipe(delay(this.LATENCIA));
  }

  logout(): void {
    this.gravarLogado(null);
  }

  estaAutenticado(): boolean {
    return this.lerLogado() !== null;
  }

  getUsuarioLogado(): Usuario | null {
    return this.lerLogado();
  }

  registrar(dados: Omit<Usuario, 'id' | 'empresasId'>): Observable<Usuario> {
    const usuarios = this.lerUsuarios();
    
    // Validar se email já existe
    if (usuarios.some((u) => u.email === dados.email)) {
      return throwError(() => new Error('Email já cadastrado'));
    }

    const novoUsuario: Usuario = {
      ...dados,
      id: usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1,
      empresasId: [],
    };

    usuarios.push(novoUsuario);
    this.gravarUsuarios(usuarios);
    this.gravarLogado(novoUsuario);

    return of(novoUsuario).pipe(delay(this.LATENCIA));
  }
}
