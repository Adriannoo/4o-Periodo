package br.edu.uniamerica.projeto_4periodo.controller;

import br.edu.uniamerica.projeto_4periodo.controller.dto.ApiResponse;
import br.edu.uniamerica.projeto_4periodo.controller.dto.MovimentacaoRequestDTO;
import br.edu.uniamerica.projeto_4periodo.controller.dto.MovimentacaoResponseDTO;
import br.edu.uniamerica.projeto_4periodo.entity.enums.TipoMovimentacao;
import br.edu.uniamerica.projeto_4periodo.service.MovimentacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimentacoes")
public class MovimentacaoController {

    private final MovimentacaoService movimentacaoService;

    public MovimentacaoController(MovimentacaoService movimentacaoService) {
        this.movimentacaoService = movimentacaoService;
    }

    // POST http://localhost:8080/api/movimentacoes
    @PostMapping
    public ResponseEntity<ApiResponse<MovimentacaoResponseDTO>> criar(@RequestBody MovimentacaoRequestDTO dto) {
        MovimentacaoResponseDTO resposta = movimentacaoService.criar(dto);
        return new ResponseEntity<>(
                new ApiResponse<>("Movimentacao criada com sucesso", resposta),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MovimentacaoResponseDTO>>> listar() {
        List<MovimentacaoResponseDTO> lista = movimentacaoService.listar();
        return new ResponseEntity<>(
                new ApiResponse<>("Movimentacoes listadas com sucesso", lista),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovimentacaoResponseDTO>> buscarPorId(@PathVariable Long id) {
        MovimentacaoResponseDTO resposta = movimentacaoService.buscarPorId(id);
        return new ResponseEntity<>(
                new ApiResponse<>("Movimentacao encontrada", resposta),
                HttpStatus.OK
        );
    }

    @GetMapping("/filtro")
    public ResponseEntity<ApiResponse<List<MovimentacaoResponseDTO>>> filtrarPorTipo(@RequestParam TipoMovimentacao tipo) {
        List<MovimentacaoResponseDTO> lista = movimentacaoService.filtrarPorTipo(tipo);
        return new ResponseEntity<>(
                new ApiResponse<>("Movimentacoes filtradas com sucesso", lista),
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MovimentacaoResponseDTO>> atualizar(
            @PathVariable Long id,
            @RequestBody MovimentacaoRequestDTO dto) {
        MovimentacaoResponseDTO resposta = movimentacaoService.atualizar(id, dto);
        return new ResponseEntity<>(
                new ApiResponse<>("Movimentacao atualizada com sucesso", resposta),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        movimentacaoService.deletar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}