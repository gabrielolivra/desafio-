import axios from 'axios';
import { IPokemonGatewayDetail, IPokemonGatewayListResponse, IPokemonType } from './pokemon.contract';

export class PokemonGateway {
  private readonly baseUrl = process.env.API_POKEMON_URL;

  async getAllPokemons(page: number = 1, limit: number = 20): Promise<IPokemonType[]> {
    let pokemonList = []
    try {
      const response = await axios.get<IPokemonGatewayListResponse>(
        `${this.baseUrl}/pokemon?limit=${limit}&offset=${page}`
      );

      for (const item of response.data.results) {
        const pokemonDetail = await this.getPokemonByName(item.name.toLocaleLowerCase());
        let pokemonInfo = {
          id: pokemonDetail.id,
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
      throw new Error(`Pokemon not found: ${name}`);
    }
  }

}