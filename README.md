# API de Movimentações Financeiras

Projeto acadêmico (Entrega Parcial 1) desenvolvido em Spring Boot, com CRUD completo de movimentações financeiras.

## Tecnologias

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- H2 Database
- Lombok

## Estrutura do projeto (MVC)

```
br.edu.uniamerica.projeto_4periodo
├── controller
│   └── dto
├── service
├── repository
├── entity
│   └── enums
```

- **entity**: representa a tabela do banco (`MovimentacaoEntity`, com os enums `TipoMovimentacao` e `FormaPagamento`)
- **dto**: objetos de entrada e saída da API, usando `record` (`MovimentacaoRequestDTO`, `MovimentacaoResponseDTO`, `ApiResponse<T>`)
- **repository**: acesso ao banco via Spring Data JPA
- **service**: regras de negócio e conversão entre Entity e DTO
- **controller**: recebe as requisições HTTP e devolve as respostas

## Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/movimentacoes` | Cria uma movimentação |
| GET | `/api/movimentacoes` | Lista todas as movimentações |
| GET | `/api/movimentacoes/{id}` | Busca uma movimentação pelo ID |
| GET | `/api/movimentacoes/filtro?tipo=ENTRADA` | Filtra movimentações por tipo |
| PUT | `/api/movimentacoes/{id}` | Atualiza uma movimentação |
| DELETE | `/api/movimentacoes/{id}` | Remove uma movimentação |

## Exemplo de requisição (POST)

```json
{
  "empresa": "Empresa Teste",
  "conta": "Conta Corrente",
  "categoria": "Vendas",
  "tipo": "ENTRADA",
  "descricao": "Pagamento de cliente",
  "valor": 1500.00,
  "data": "2026-08-14",
  "forma": "PIX"
}
```

## Exemplo de resposta

```json
{
  "mensagem": "Movimentação criada com sucesso",
  "dados": {
    "id": 1,
    "empresa": "Empresa Teste",
    "conta": "Conta Corrente",
    "categoria": "Vendas",
    "tipo": "ENTRADA",
    "descricao": "Pagamento de cliente",
    "valor": 1500.00,
    "data": "2026-08-14",
    "forma": "PIX"
  }
}
```

## Códigos HTTP utilizados

| Situação | Código |
|---|---|
| Criou uma movimentação | 201 Created |
| Listou ou buscou dados | 200 OK |
| Atualizou uma movimentação | 200 OK |
| Deletou uma movimentação | 204 No Content |
| Não encontrou o ID | 404 Not Found |

## Como executar

1. Clone o repositório
2. Rode a aplicação (`Projeto4periodoApplication`)
3. A API sobe em `http://localhost:8080`
4. Teste os endpoints com Insomnia ou Postman