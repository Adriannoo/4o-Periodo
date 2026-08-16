package br.edu.uniamerica.parceiro_auto.repository;

import br.edu.uniamerica.parceiro_auto.entity.Movimentacao;
import br.edu.uniamerica.parceiro_auto.entity.enums.TipoMovimentacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long>{

    // Spring Data JPA faz as querys sozinhas, so precisa declarar os metodos na

    List<Movimentacao> findByTipo(TipoMovimentacao tipo);

}
