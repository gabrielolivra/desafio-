import PokemonSchema from "../entities/schema"
import { IPokemon } from "./contract/pokemon.contract";


export async function createPokemon(data: IPokemon): Promise<IPokemon> {
  const newPokemon = await PokemonSchema.create(data);
  return newPokemon as any;
}

export async function findPokemons(): Promise<IPokemon[]> {
  const pokemons: IPokemon[] = await PokemonSchema.find();
  return pokemons;
  
}

export async function updatePokemon(id: string, data: Partial<IPokemon>): Promise<IPokemon | null> {
  const updatedPokemon: IPokemon | null = await PokemonSchema.findByIdAndUpdate(
    id,
    { ...data },
    { new: true }
  );
  return updatedPokemon;
}

export async function getPokemonByName(name: string): Promise<IPokemon | null> {
  const pokemon: IPokemon | null = await PokemonSchema.findOne({ pokemonName: name });
  return pokemon;
}

export async function verifyQuantityPokemon(): Promise<boolean> {
  const favoritePokemon = await PokemonSchema.find({ favorite: true });
  return favoritePokemon.length > 3;
}
