import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cnpjValidator(control: AbstractControl): ValidationErrors | null {
  const valor: string = (control.value ?? '').replace(/\D/g, '');

  if (!valor) {
    return null;
  }

  if (valor.length !== 14 || /^(\d)\1{13}$/.test(valor)) {
    return { cnpjInvalido: true };
  }

  const calculaDigito = (base: string): number => {
    let peso = base.length - 7;
    let soma = 0;

    for (const digito of base) {
      soma += Number(digito) * peso--;
      if (peso < 2) {
        peso = 9;
      }
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiro = calculaDigito(valor.substring(0, 12));
  const segundo = calculaDigito(valor.substring(0, 13));

  const valido = primeiro === Number(valor[12]) && segundo === Number(valor[13]);

  return valido ? null : { cnpjInvalido: true };
}

export function formatarCnpj(valor: string): string {
  return (valor ?? '')
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function formatarTelefone(valor: string): string {
  return (valor ?? '')
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
}

export function formatarCep(valor: string): string {
  return (valor ?? '')
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, '$1-$2');
}