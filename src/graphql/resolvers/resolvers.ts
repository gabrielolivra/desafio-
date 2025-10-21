import { addStatusPokemon, listPokemons } from "../../services/pokemon/pokemon";
import PokemonSchema from "../../entities/schema";

export const resolvers = {
    Query: {
       hello: () => 'Hello, Pokemon!', 
         pokemons: async () => {
           const a  = await listPokemons();
           return a;
       }
       
    },
Mutation: {
      addStatusPokemon: async (_: any, args: { input: any }) => {
        const { name, nickName, favorite, powerLevel } = args.input;
        return await addStatusPokemon(name, nickName, favorite, powerLevel);
      },
//TODO Implement the createPokemon resolver
      createPokemon: async (_: any, args: { input: any }) => {
        const { pokemonName, nickName, favorite, powerLevel } = args.input;
        console.log('Creating Pokemon with data:', args.input);
        const newPokemon = PokemonSchema.create({
          pokemonName,
          nickName,
          favorite,
          powerLevel
        });
        return await newPokemon;
      }
    }
};