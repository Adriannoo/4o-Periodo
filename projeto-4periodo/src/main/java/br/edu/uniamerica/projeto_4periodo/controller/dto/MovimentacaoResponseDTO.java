package br.edu.uniamerica.projeto_4periodo.controller.dto;

import br.edu.uniamerica.projeto_4periodo.entity.enums.FormaPagamento;
import br.edu.uniamerica.projeto_4periodo.entity.enums.TipoMovimentacao;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MovimentacaoResponseDTO(
        Long id,
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
