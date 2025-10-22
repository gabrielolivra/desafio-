import { ICreateOrUpdatePokemon } from "../../services/contract/pokemon/pokemon.contract";
import { createPokemonAttributesService, listPokemonsService } from "../../services/pokemon/pokemon.service";

export const resolvers = {
  Query: {
    pokemons: async (_: any, args: { page: number, limit: number }) => {
      const { page, limit } = args;
      const pokemons = await listPokemonsService(page, limit);
      return pokemons;
    }
  },

  Mutation: {
    createPokemonAttributes: async (_: any, args: { input: ICreateOrUpdatePokemon }) => {
      const { input } = args;
      return await createPokemonAttributesService(input);
    }
  }
};