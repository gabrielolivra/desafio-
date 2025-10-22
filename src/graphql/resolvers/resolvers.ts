import { createOrUpdatePokemonService, listPokemonsService } from "../../services/pokemon/pokemon";
import PokemonSchema from "../../entities/schema";

export const resolvers = {
    Query: {
      pokemons: async (_: any, args: { limit: number, offset: number }) => {
        const { limit, offset } = args;
        const pokemons = await listPokemonsService(limit, offset);
        return pokemons;
      }   
    },

Mutation: {
      // addStatusPokemon: async (_: any, args: { input: any }) => {
      //   const { name, nickName, favorite, powerLevel } = args.input;
      //   return await addStatusPokemon(name, nickName, favorite, powerLevel);
      // }, 
//TODO Implement the createPokemon resolver
      createPokemon: async (_: any, args: { input: { pokemonName: string, nickname: string, favorite: boolean, powerLevel: number } }) => {
        const { pokemonName, nickname, favorite, powerLevel } = args.input;
        return await createOrUpdatePokemonService(pokemonName, nickname, favorite, powerLevel);
      }
    }
};