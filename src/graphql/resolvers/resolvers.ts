import { ICreateOrUpdatePokemon } from "../../services/contract/pokemon/pokemon.contract";
import { createOrUpdatePokemonService, listPokemonsService } from "../../services/pokemon/pokemon.service";

export const resolvers = {
  Query: {
    pokemons: async (_: any, args: { page: number, limit: number }) => {
      const { page, limit } = args;
      const pokemons = await listPokemonsService(page, limit);
      return pokemons;
    }
  },

  Mutation: {
    createOrUpdatePokemon: async (_: any, args: { input: ICreateOrUpdatePokemon }) => {
      return await createOrUpdatePokemonService(args.input);
    }
  }
};