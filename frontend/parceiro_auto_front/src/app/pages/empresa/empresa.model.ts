export type RegimeTributario =
  | 'MEI'
  | 'SIMPLES_NACIONAL'
  | 'LUCRO_PRESUMIDO'
  | 'LUCRO_REAL';

export type PorteEmpresa = 'MEI' | 'ME' | 'EPP' | 'DEMAIS';

export type NaturezaJuridica = 'EI' | 'SLU' | 'LTDA' | 'SA' | 'SS';

export interface Empresa {
  id: number;

  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;

  naturezaJuridica: NaturezaJuridica;
  regime: RegimeTributario;
  porte: PorteEmpresa;

  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;

  telefone: string;
  email: string;

  ativa: boolean;
}

interface Opcao<T> {
  valor: T;
  rotulo: string;
}

export const REGIMES: Opcao<RegimeTributario>[] = [
  { valor: 'MEI', rotulo: 'MEI' },
  { valor: 'SIMPLES_NACIONAL', rotulo: 'Simples Nacional' },
  { valor: 'LUCRO_PRESUMIDO', rotulo: 'Lucro Presumido' },
  { valor: 'LUCRO_REAL', rotulo: 'Lucro Real' },
];

export const PORTES: Opcao<PorteEmpresa>[] = [
  { valor: 'MEI', rotulo: 'MEI' },
  { valor: 'ME', rotulo: 'Microempresa (ME)' },
  { valor: 'EPP', rotulo: 'Empresa de Pequeno Porte (EPP)' },
  { valor: 'DEMAIS', rotulo: 'Demais' },
];

export const NATUREZAS: Opcao<NaturezaJuridica>[] = [
  { valor: 'EI', rotulo: 'Empresário Individual' },
  { valor: 'SLU', rotulo: 'Sociedade Limitada Unipessoal' },
  { valor: 'LTDA', rotulo: 'Sociedade Empresária Limitada' },
  { valor: 'SA', rotulo: 'Sociedade Anônima' },
  { valor: 'SS', rotulo: 'Sociedade Simples' },
];

export const UFS: string[] = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

function rotuloDe<T>(lista: Opcao<T>[], valor: T): string {
  return lista.find((o) => o.valor === valor)?.rotulo ?? String(valor);
}

export const rotuloRegime = (v: RegimeTributario) => rotuloDe(REGIMES, v);
export const rotuloPorte = (v: PorteEmpresa) => rotuloDe(PORTES, v);
export const rotuloNatureza = (v: NaturezaJuridica) => rotuloDe(NATUREZAS, v);

/** Endereço em uma linha, para exibir em tabelas e fichas. */
export function enderecoResumido(e: Empresa): string {
  const complemento = e.complemento ? `, ${e.complemento}` : '';
  return `${e.logradouro}, ${e.numero}${complemento} — ${e.bairro}, ${e.cidade}/${e.uf}`;
}