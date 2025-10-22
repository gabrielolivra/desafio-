import { PokemonGateway } from "../../gateways/pokemon/pokemon";
import {
  createPokemon,
  findPokemons,
  findPokemonByName,
  updatePokemon,
  findQuantityPokemonsByFavorite
} from "../../models/pokemon";
import { ICreateOrUpdatePokemon, IPokemonContract } from "../contract/pokemon/pokemon.contract";

export async function createOrUpdatePokemonService(
  data: ICreateOrUpdatePokemon
): Promise<IPokemonContract> {
  const gateway = new PokemonGateway();

  const pokemonData = await gateway.getPokemonByName(data.pokemonName.toLocaleLowerCase());

  if (!pokemonData) {
    throw new Error(`Pokemon with name ${data.pokemonName} not found in external API.`);
  }

  if (data.powerLevel < 1 || data.powerLevel > 100) {
    throw new Error("Power level must be between 1 and 100.");
  }

  if (data.favorite) {
    const reachedFavoriteLimit = await verifyLimitFavorite();
    if (reachedFavoriteLimit) {
      throw new Error("Cannot have more than 3 favorite Pokemons.");
    }
  }

  const existingPokemon = await findPokemonByName(data.pokemonName.toLowerCase());

  if (existingPokemon) {
    const updatedPokemon = await updatePokemon(existingPokemon.id,
      {
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
  let mergePokemons = [];

  for (const pokemon of pokemonsList) {
    const pokemonInDB = pokemonsFromDB.find(p => p.pokemonName.toLowerCase() === pokemon.name);
    if (pokemonInDB) {
      mergePokemons.push({
        ...pokemon,
        favorite: pokemonInDB.favorite,
        nickname: pokemonInDB.nickname,
        powerLevel: pokemonInDB.powerLevel,
        id: pokemonInDB.id.toString()
      });
    }
    else {
      mergePokemons.push({
        ...pokemon
      });
    }
  }

  return mergePokemons as IPokemonContract[];
}

async function verifyLimitFavorite(): Promise<boolean> {
  const quantityFavoritePokemons = await findQuantityPokemonsByFavorite(true);
  return quantityFavoritePokemons >= 3;
}
