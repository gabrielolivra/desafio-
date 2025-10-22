import { PokemonGateway } from "../../gateways/pokemon/pokemon";
import { IPokemon } from "../../models/contract/pokemon.contract";
import { findPokemons, getPokemonByName, verifyQuantityPokemon } from "../../models/pokemon";



export async function addStatusPokemonService(name: string, nickName: string, favorite: boolean, powerLevel: number): Promise<any> {
    const gateway = new PokemonGateway();
    const pokemonData = await gateway.getPokemonByName(name);
    
    return {
        ...pokemonData,
        nickName,
        favorite,
        powerLevel
    };
}

export async function listPokemonsService(): Promise<any[]> {
    const data = await findPokemons();
    const gateway = new PokemonGateway();

    const pokemonPromises = data.map(async (pokemon) => {
        const pokemonDoc = pokemon as unknown as any;

    try {
    
      const pokemonData = await gateway.getPokemonByName(
        pokemonDoc.pokemonName.toString().toLowerCase()
      );
      
      const mergedPokemon = {
        id: (pokemonDoc as any)._id.toString(),
        name: pokemonData.name,
        height: pokemonData.height,
        weight: pokemonData.weight,
        abilities: pokemonData.abilities.map(ability => ability.ability.name),
        types: pokemonData.types.map(type => type.type.name),
        pokemonName: pokemonDoc.pokemonName,
        nickName: pokemonDoc.nickName,
        favorite: pokemonDoc.favorite,
        powerLevel: pokemonDoc.powerLevel
      };
      
      return mergedPokemon;
    } catch (error) {
      console.error(`Erro ao buscar dados do Pokemon ${pokemonDoc.pokemonName}:`, error);
      
      const fallbackPokemon = {
        id: (pokemonDoc as any)._id.toString(),
        name: pokemonDoc.pokemonName,
        height: 0,
        weight: 0,
        abilities: [],
        types: [],
        pokemonName: pokemonDoc.pokemonName,
        nickName: pokemonDoc.nickName,
        favorite: pokemonDoc.favorite,
        powerLevel: pokemonDoc.powerLevel
      };
      
      return fallbackPokemon;
    }
  });
  
 
  const mergedPokemons = await Promise.all(pokemonPromises);
  
  return mergedPokemons;
}

export async function updatePokemon(id: string, data: Partial<IPokemon>): Promise<IPokemon> {
    const verifyPokemon = await getPokemonByName(data.nickName!);
    if (!verifyPokemon) {
        throw new Error(`Pokemon with name ${data.nickName} does not exist.`);
    }

    const verifyFavoriteCount = await verifyQuantityPokemon();
    if (verifyFavoriteCount && data.favorite) {
        throw new Error("Cannot have more than 3 favorite Pokemons.");
    }
    const updatedPokemon = await updatePokemon(id, data);
    return updatedPokemon;
}