import axios from 'axios';
import { IPokemonGatewayDetail, IPokemonGatewayListResponse, IPokemonType } from './pokemon.contract';
import { DEFAULT_POKEMON_LIMIT, DEFAULT_POKEMON_PAGE, MAX_LIMIT_POKEMONS } from '../../consts/pokemon/pokemons.consts';

export class PokemonGateway {
  private readonly baseUrl = process.env.API_POKEMON_URL;

  async getAllPokemons(page: number = 0, limit: number = 10): Promise<IPokemonType[]> {

    if (page < 0) {
      page = DEFAULT_POKEMON_PAGE;
    }
    if (limit < 1) {
      limit = DEFAULT_POKEMON_LIMIT;
    }

    if (limit > MAX_LIMIT_POKEMONS) {
      limit = MAX_LIMIT_POKEMONS;
    }

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