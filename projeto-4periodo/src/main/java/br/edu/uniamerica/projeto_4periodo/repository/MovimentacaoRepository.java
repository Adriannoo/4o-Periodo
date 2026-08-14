package br.edu.uniamerica.projeto_4periodo.repository;

import br.edu.uniamerica.projeto_4periodo.entity.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long>{
}
