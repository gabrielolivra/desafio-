import { MAX_FAVORITE_POKEMONS, POKEMON_POWERLEVEL_MAX, POKEMON_POWERLEVEL_MIN } from "../../consts/pokemon/pokemons.consts";
import { PokemonGateway } from "../../gateways/pokemon/pokemon.gateway";
import {
  createPokemon,
  findPokemons,
  findPokemonByName,
  updatePokemon,
  findQuantityPokemonsByFavorite
} from "../../models/pokemon.model";
import { ICreateOrUpdatePokemon, IPokemonContract } from "../contract/pokemon/pokemon.contract";

export async function createPokemonAttributesService(
  data: ICreateOrUpdatePokemon
): Promise<IPokemonContract> {
  const pokemonGateway = new PokemonGateway();

  const pokemonData = await pokemonGateway.getPokemonByName(data.pokemonName.toLocaleLowerCase());

  if (!pokemonData) {
    throw new Error(`Pokemon with name ${data.pokemonName} not found in external API.`);
  }

  if (data.powerLevel < POKEMON_POWERLEVEL_MIN || data.powerLevel > POKEMON_POWERLEVEL_MAX) {
    throw new Error(`Power level must be between ${POKEMON_POWERLEVEL_MIN} and ${POKEMON_POWERLEVEL_MAX}.`);
  }

  const existingPokemon = await findPokemonByName(data.pokemonName.toLowerCase());

  if (data.favorite && !existingPokemon) {
    const reachedFavoriteLimit = await verifyLimitFavorite();
    if (reachedFavoriteLimit) {
      throw new Error("Cannot have more than 3 favorite Pokemons.");
    }
  }

  if (existingPokemon) {
    const updatedPokemon = await updatePokemon(existingPokemon.id,
      {
        pokemonName: existingPokemon.pokemonName,
        nickname: data.nickname,
        favorite: data.favorite,
        powerLevel: data.powerLevel
      });

    return {
      ...pokemonData,
      types: pokemonData.types.map(t => t.type.name),
      id: updatedPokemon!.id,
      nickname: updatedPokemon!.nickname,
      favorite: updatedPokemon!.favorite,
      powerLevel: updatedPokemon!.powerLevel,
    };

  }

  const savedPokemon = await createPokemon({
    pokemonName: pokemonData.name,
    nickname: data.nickname,
    favorite: data.favorite,
    powerLevel: data.powerLevel,
  });

  return {
    ...pokemonData,
    types: pokemonData.types.map(t => t.type.name),
    id: savedPokemon.id.toString(),
    nickname: savedPokemon.nickname,
    favorite: savedPokemon.favorite,
    powerLevel: savedPokemon.powerLevel,
  };

}

export async function listPokemonsService(page: number, limit: number): Promise<IPokemonContract[]> {
  const gatewayPokemons = new PokemonGateway();
  const pokemonsList = await gatewayPokemons.getAllPokemons(page, limit);
  const pokemonsFromDB = await findPokemons();
  let mergedPokemons = [];

  for (const pokemon of pokemonsList) {
    const pokemonInDB = pokemonsFromDB.find(p => p.pokemonName.toLowerCase() === pokemon.name);
    if (pokemonInDB) {
      mergedPokemons.push({
        ...pokemon,
        favorite: pokemonInDB.favorite,
        nickname: pokemonInDB.nickname,
        powerLevel: pokemonInDB.powerLevel,
        id: pokemonInDB.id.toString()
      });
    }
    else {
      mergedPokemons.push({
        ...pokemon
      });
    }
  }

  return mergedPokemons as IPokemonContract[];
}

async function verifyLimitFavorite(): Promise<boolean> {
  const quantityFavoritePokemons = await findQuantityPokemonsByFavorite(true);
  return quantityFavoritePokemons >= MAX_FAVORITE_POKEMONS;
}
