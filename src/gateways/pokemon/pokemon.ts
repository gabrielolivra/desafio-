import axios from 'axios';
import { IPokemonGatewayDetail, IPokemonGatewayListResponse } from './types';



export class PokemonGateway {
    private readonly baseUrl = process.env.API_POKEMON_URL;

    async getAllPokemons(limit: number = 20, offset: number = 0): Promise<IPokemonGatewayListResponse> {
        try {
            const response = await axios.get<IPokemonGatewayListResponse>(
                `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
            );
            return response.data;
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