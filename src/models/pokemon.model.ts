import PokemonSchema from "../entities/pokemon/schema"
import { IPokemon } from "./contract/pokemon.contract";

export async function createPokemon(data: Partial<IPokemon>): Promise<IPokemon> {
  const newPokemon = await PokemonSchema.create(
    { ...data, pokemonName: data.pokemonName?.toLowerCase() }
  );
  return newPokemon as unknown as IPokemon;
}

export async function updatePokemon(id: string, data: Partial<IPokemon>): Promise<IPokemon | null> {
  const updatedPokemon: IPokemon | null = await PokemonSchema.findByIdAndUpdate(
    id,
    { ...data },
    { new: true }
  );
  return updatedPokemon;
}

export async function findPokemonByName(name: string): Promise<IPokemon | null> {
  const pokemon: IPokemon | null = await PokemonSchema.findOne({ pokemonName: name });
  return pokemon;
}

export async function findQuantityPokemonsByFavorite(favorite: boolean): Promise<number> {
  const pokemons: IPokemon[] = await PokemonSchema.find({ favorite });
  return pokemons.length;
}

