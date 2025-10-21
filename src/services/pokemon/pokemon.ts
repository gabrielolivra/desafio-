import { PokemonGateway } from "../../gateways/pokemon/pokemon";

export async function listPokemons(): Promise<any> {
    const gateway = new PokemonGateway();
    const response = await gateway.getAllPokemons(10, 0);
    return response.results.map((pokemon: any) => ({
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        abilities: pokemon.abilities,
        types: pokemon.types,
        nickName: pokemon.nickName,
        favorite: pokemon.favorite,
        powerLevel: pokemon.powerLevel
    }));
} 

export async function addStatusPokemon(name: string, nickName: string, favorite: boolean, powerLevel: number): Promise<any> {
    const gateway = new PokemonGateway();
    const pokemonData = await gateway.getPokemonByName(name);
    
    return {
        ...pokemonData,
        nickName,
        favorite,
        powerLevel
    };
}

