import { PokemonGateway } from "../../gateways/pokemon/pokemon";
import { IPokemon } from "../../models/contract/pokemon.contract";
import { findPokemons, getPokemonByName, verifyQuantityPokemon } from "../../models/pokemon";
import { IPokemonContract } from "../contract/pokemon.contract.service";



export async function addStatusPokemonService(name: string, nickname: string, favorite: boolean, powerLevel: number): Promise<IPokemonContract> {
    const gateway = new PokemonGateway();
    const pokemonData = await gateway.getPokemonByName(name);
    if (!pokemonData) {
        throw new Error(`Pokemon with name ${name} not found in external API.`);
    }

    if (favorite) {
        const verifyFavoriteCount = await verifyQuantityPokemon();
        if (verifyFavoriteCount) {
            throw new Error("Cannot have more than 3 favorite Pokemons.");
        }
    }

    if (powerLevel < 1 || powerLevel > 100) {
        throw new Error("Power level must be between 1 and 100.");
    }

    const newPokemon: IPokemonContract = {
        id: pokemonData.id.toString(),
        name: pokemonData.name,
        height: pokemonData.height,
        weight: pokemonData.weight,
        types: pokemonData.types.map(type => type.type.name),
        nickname,
        favorite,
        powerLevel
    };

    return newPokemon;
}

export async function listPokemonsService(limit: number, offset: number): Promise<any[]> {
    const gatewayPokemons = new PokemonGateway();
    const pokemonsList = await gatewayPokemons.getAllPokemons(limit, offset);
    const pokemonsFromDB = await findPokemons();
    let mergePokemons = [];

    for (const pokemon of pokemonsList) {
        const pokemonInDB = pokemonsFromDB.find(p => p.pokemonName.toLowerCase() === pokemon.name.toLowerCase());
        if (pokemonInDB) {
            mergePokemons.push({ ...pokemon, favorite: pokemonInDB.favorite, nickname: pokemonInDB.nickname, powerLevel: pokemonInDB.powerLevel });
        }
        else {
            mergePokemons.push({ ...pokemon });
        }
    }

    return mergePokemons;
}

export async function updatePokemon(id: string, data: Partial<IPokemon>): Promise<IPokemon> {
    const verifyPokemon = await getPokemonByName(data.nickname!);
    if (!verifyPokemon) {
        throw new Error(`Pokemon with name ${data.nickname} does not exist.`);
    }

    const verifyFavoriteCount = await verifyQuantityPokemon();
    if (verifyFavoriteCount && data.favorite) {
        throw new Error("Cannot have more than 3 favorite Pokemons.");
    }
    const updatedPokemon = await updatePokemon(id, data);
    return updatedPokemon;
}