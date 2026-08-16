export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  papel: 'admin' | 'usuario';
  empresasId: number[];
  ativo: boolean;
}
