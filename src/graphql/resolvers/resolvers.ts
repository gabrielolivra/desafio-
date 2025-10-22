import { ICreateOrUpdatePokemon } from "../../services/contract/pokemon.contract.service";
import { createOrUpdatePokemonService, listPokemonsService } from "../../services/pokemon/pokemon";

export const resolvers = {
  Query: {
    pokemons: async (_: any, args: { perPage: number, page: number }) => {
      const { perPage, page } = args;
      const pokemons = await listPokemonsService(perPage, page);
      return pokemons;
    }
  },

  Mutation: {
    createOrUpdatePokemon: async (_: any, args: { input: ICreateOrUpdatePokemon }) => {
      return await createOrUpdatePokemonService(args.input);
    }
  }
};