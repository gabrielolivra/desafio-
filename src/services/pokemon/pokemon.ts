import { PokemonGateway } from "../../gateways/pokemon/pokemon";
import { IPokemon } from "../../models/contract/pokemon.contract";
import { createPokemon, findPokemons, getPokemonByName, updatePokemon, verifyQuantityPokemon } from "../../models/pokemon";
import { IPokemonContract } from "../contract/pokemon.contract.service";



export async function createOrUpdatePokemonService(
    name: string,
    nickname: string,
    favorite: boolean,
    powerLevel: number
): Promise<IPokemonContract> {
    const gateway = new PokemonGateway();
    const pokemonData = await gateway.getPokemonByName(name);

    if (!pokemonData) {
        throw new Error(`Pokemon with name ${name} not found in external API.`);
    }

    if (powerLevel < 1 || powerLevel > 100) {
        throw new Error("Power level must be between 1 and 100.");
    }

    if (favorite) {
        const reachedFavoriteLimit = await verifyQuantityPokemon();
        if (reachedFavoriteLimit) {
            throw new Error("Cannot have more than 3 favorite Pokemons.");
        }
    }

    const existingPokemon = await getPokemonByName(name.toLowerCase());

    if (existingPokemon) {
        const updatedPokemon = await updatePokemon(existingPokemon.id, { nickname, favorite, powerLevel });
        return {
            id: updatedPokemon!.id,
            name: pokemonData.name,
            height: pokemonData.height,
            weight: pokemonData.weight,
            types: pokemonData.types.map(t => t.type.name),
            nickname: updatedPokemon!.nickname,
            favorite: updatedPokemon!.favorite,
            powerLevel: updatedPokemon!.powerLevel,
        };
    }
    const savedPokemon = await createPokemon({
        pokemonName: pokemonData.name,
        nickname,
        favorite,
        powerLevel,
    });

    return {
        id: savedPokemon.id,
        name: pokemonData.name,
        height: pokemonData.height,
        weight: pokemonData.weight,
        types: pokemonData.types.map(t => t.type.name),
        nickname: savedPokemon.nickname,
        favorite: savedPokemon.favorite,
        powerLevel: savedPokemon.powerLevel,
    };
}


export async function listPokemonsService(limit: number, offset: number): Promise<IPokemonContract[]> {
    const gatewayPokemons = new PokemonGateway();
    const pokemonsList = await gatewayPokemons.getAllPokemons(limit, offset);
    const pokemonsFromDB = await findPokemons();
    let mergePokemons = [];

    for (const pokemon of pokemonsList) {
        const pokemonInDB = pokemonsFromDB.find(p => p.pokemonName.toLowerCase() === pokemon.name.toLowerCase());
        if (pokemonInDB) {
            mergePokemons.push({ ...pokemon, favorite: pokemonInDB.favorite, nickname: pokemonInDB.nickname, powerLevel: pokemonInDB.powerLevel, id: pokemonInDB.id.toString() });
        }
        else {
            mergePokemons.push({ ...pokemon, favorite: false, nickname: "", powerLevel: -1, id: "-1" });
        }
    }

    return mergePokemons;
}
