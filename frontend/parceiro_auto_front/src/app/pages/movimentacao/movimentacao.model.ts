export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';

export type FormaPagamento =
  | 'PIX'
  | 'DINHEIRO'
  | 'CARTAO_CREDITO'
  | 'CARTAO_DEBITO'
  | 'BOLETO'
  | 'TRANSFERENCIA';

export interface Movimentacao {
  id: number;
  empresaId: number;
  conta: string;
  categoria: string;
  tipo: TipoMovimentacao;
  descricao: string;
  valor: number;
  data: string;
  forma: FormaPagamento;
}

export const TIPOS: { valor: TipoMovimentacao; rotulo: string }[] = [
  { valor: 'ENTRADA', rotulo: 'Entrada' },
  { valor: 'SAIDA', rotulo: 'Saída' },
];

export const FORMAS: { valor: FormaPagamento; rotulo: string }[] = [
  { valor: 'PIX', rotulo: 'PIX' },
  { valor: 'DINHEIRO', rotulo: 'Dinheiro' },
  { valor: 'CARTAO_CREDITO', rotulo: 'Cartão de crédito' },
  { valor: 'CARTAO_DEBITO', rotulo: 'Cartão de débito' },
  { valor: 'BOLETO', rotulo: 'Boleto' },
  { valor: 'TRANSFERENCIA', rotulo: 'Transferência' },
];

export const CONTAS: string[] = [
  'Conta Corrente',
  'Conta Poupança',
  'Caixa',
  'Aplicação',
];

export const CATEGORIAS: string[] = [
  'Vendas',
  'Serviços',
  'Peças',
  'Fornecedores',
  'Salários',
  'Impostos',
  'Aluguel',
  'Energia',
  'Manutenção',
  'Outros',
];

export function rotuloForma(forma: FormaPagamento): string {
  return FORMAS.find((f) => f.valor === forma)?.rotulo ?? forma;
}