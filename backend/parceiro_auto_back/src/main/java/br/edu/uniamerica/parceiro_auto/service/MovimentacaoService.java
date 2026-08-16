package br.edu.uniamerica.parceiro_auto.service;

import br.edu.uniamerica.parceiro_auto.controller.dto.MovimentacaoRequestDTO;
import br.edu.uniamerica.parceiro_auto.controller.dto.MovimentacaoResponseDTO;
import br.edu.uniamerica.parceiro_auto.entity.enums.TipoMovimentacao;
import br.edu.uniamerica.parceiro_auto.repository.MovimentacaoRepository;
import br.edu.uniamerica.parceiro_auto.entity.Movimentacao;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepository;

    public MovimentacaoService(MovimentacaoRepository movimentacaoRepository) {
        this.movimentacaoRepository = movimentacaoRepository;
    }

    public MovimentacaoResponseDTO criar(MovimentacaoRequestDTO dto) {
        Movimentacao entity = new Movimentacao();

        entity.setEmpresa(dto.empresa());
        entity.setConta(dto.conta());
        entity.setCategoria(dto.categoria());
        entity.setTipo(dto.tipo());
        entity.setDescricao(dto.descricao());
        entity.setValor(dto.valor());
        entity.setData(dto.data());
        entity.setForma(dto.forma());

        Movimentacao salvo = movimentacaoRepository.save(entity);

        return toResponseDTO(salvo);
    }

    // Metodo privado para converter entity em DTO. Evita duplicacao de codigo e facilita manutencao
    public MovimentacaoResponseDTO toResponseDTO(Movimentacao entity) {
        return new MovimentacaoResponseDTO(
                entity.getId(),
                entity.getEmpresa(),
                entity.getConta(),
                entity.getCategoria(),
                entity.getTipo(),
                entity.getDescricao(),
                entity.getValor(),
                entity.getData(),
                entity.getForma()
        );
    }

    public MovimentacaoResponseDTO atualizar(Long id, MovimentacaoRequestDTO dto) {
        Movimentacao entity = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movimentacao nao encontrada com o ID: " + id));

        entity.setEmpresa(dto.empresa());
        entity.setConta(dto.conta());
        entity.setCategoria(dto.categoria());
        entity.setTipo(dto.tipo());
        entity.setDescricao(dto.descricao());
        entity.setValor(dto.valor());
        entity.setData(dto.data());
        entity.setForma(dto.forma());

        Movimentacao atualizado = movimentacaoRepository.save(entity);

        return toResponseDTO(atualizado);
    }

    public List<MovimentacaoResponseDTO> listar() {
        return movimentacaoRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public MovimentacaoResponseDTO buscarPorId(Long id) {
        Movimentacao entity = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movimentacao nao encontrada com o ID: " + id));

        return toResponseDTO(entity);
    }

    public List<MovimentacaoResponseDTO> filtrarPorTipo(TipoMovimentacao tipo) {
        return movimentacaoRepository.findByTipo(tipo)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void deletar(Long id) {
        Movimentacao entity = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movimentacao nao encontrada com o ID: " + id));

        movimentacaoRepository.delete(entity);
    }
}
