package br.edu.uniamerica.parceiro_auto.entity;

import br.edu.uniamerica.parceiro_auto.entity.enums.FormaPagamento;
import br.edu.uniamerica.parceiro_auto.entity.enums.TipoMovimentacao;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Movimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String empresa;
    private String conta;
    private String categoria;

    @Enumerated(EnumType.STRING)
    private TipoMovimentacao tipo;

    private String descricao;
    private BigDecimal valor;
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    private FormaPagamento forma;
}
