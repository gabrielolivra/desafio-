import axios from 'axios';
import { IPokemonGatewayDetail, IPokemonGatewayListResponse } from './types';



export class PokemonGateway {
    private readonly baseUrl = process.env.API_POKEMON_URL;

    async getAllPokemons(limit: number = 20, offset: number = 0): Promise<IPokemonGatewayListResponse[]> {
        let pokemonList = []
        try {
            const response = await axios.get<any>(
                `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
            );
           
            for (const item of response.data.results) {
                const pokemonDetail = await this.getPokemonByName(item.name);
                let pokemonInfo = {
                    name: item.name,
                    height: pokemonDetail.height,
                    weight: pokemonDetail.weight,
                    types: pokemonDetail.types.map(type => type.type.name),
                };
                pokemonList.push(pokemonInfo);
            }
           
            return pokemonList
        } catch (error) {
            throw new Error('Failed to fetch Pokemon list');
        }
    }

    async getPokemonByName(name: string): Promise<IPokemonGatewayDetail> {
        try {
            const response = await axios.get<IPokemonGatewayDetail>(
                `${this.baseUrl}/pokemon/${name.toLowerCase()}`
            );
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch Pokemon: ${name}`);
        }
    }

}