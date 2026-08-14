package br.edu.uniamerica.projeto_4periodo.controller.dto;

// Classe do tipo Record, que e imutavel e serve para apresentar dados de forma simples, sem a necessidade de criar getters e setters

// <T> e um tipo "generic" que quer dizer que o record funciona para qualquer tipo de dado decidido na hora de usar
public record ApiResponse<T>(
        String mensagem,
        T dados
) {
}

/* Exemplos de uso:
*
*   - aqui T vira MovimentacaoResponseDTO
*   ApiResponse<MovimentacaoResponseDTO> resposta1 =
*          new ApiResponse<>("Movimentação criada com sucesso", minhaMovimentacao);
*
*   - aqui T vira List<MovimentacaoResponseDTO>
*   ApiResponse<List<MovimentacaoResponseDTO>> resposta2 =
*          new ApiResponse<>("Movimentações listadas com sucesso", minhaLista);
*/

/* Exemplo do resultado em JSON:
*
* {
*     "mensagem": "Movimentação criada com sucesso",
*     "dados": { "id": 1, "empresa": "...", ... }
* }
*/