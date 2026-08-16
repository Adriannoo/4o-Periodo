package br.edu.uniamerica.parceiro_auto.controller.dto;

import br.edu.uniamerica.parceiro_auto.entity.enums.FormaPagamento;
import br.edu.uniamerica.parceiro_auto.entity.enums.TipoMovimentacao;

import java.math.BigDecimal;
import java.time.LocalDate;

// Classe do tipo Record, que e imutavel e serve para apresentar dados de forma simples, sem a necessidade de criar getters e setters
public record MovimentacaoRequestDTO(
    String empresa,
    String conta,
    String categoria,
    TipoMovimentacao tipo,
    String descricao,
    BigDecimal valor,
    LocalDate data,
    FormaPagamento forma
) {
}
