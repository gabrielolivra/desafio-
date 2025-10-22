
# Desafio Node.js

## Descrição
Projeto Node.js desenvolvido como desafio técnico.

## Pré-requisitos
- Node.js
- Docker
- Docker Compose

## Instalação

### Usando Docker Compose
```bash
# Baixar as imagens 
docker-compose pull
# Execute com Docker Compose
docker-compose up -d
```

### Instalação Local
```bash
# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

## Uso
Mongo express: `http://localhost:8081`
Apollo: `http://localhost:3000/graphql`

## Scripts Disponíveis
- `npm run dev` - Modo desenvolvimento

## Tecnologias Utilizadas
- Node.js
- Docker
- Docker Compose

## GraphQL

Query:
```bash
query Query {

  pokemons(perPage:10, page: 1) {
    id
    name,
    powerLevel
    nickname
    favorite
    types
    height
    weight

  }
}

```

Mutation: 
```bash
mutation CreatePokemon {
  createOrUpdatePokemon(input: {
    pokemonName: "venusaur"
    nickname: "saur"
    favorite: false
    powerLevel: 12,
  }) {
    favorite
    powerLevel
    id
    height
    weight
    name
    nickname
    types
  }
}

```