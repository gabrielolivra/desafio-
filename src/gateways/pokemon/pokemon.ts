import axios from 'axios';
import { IPokemonGatewayDetail } from './types';

export class PokemonGateway {
    private readonly baseUrl = process.env.API_POKEMON_URL;

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