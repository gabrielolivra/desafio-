export interface IPokemonContract {
  id: string;
  name: string;
  height: number;
  weight: number;
  types: string[];
  nickname?: string | null;
  favorite?: boolean | null;
  powerLevel?: number | null;
}

export interface ICreateOrUpdatePokemon {
  pokemonName: string;
  nickname: string;
  favorite: boolean;
  powerLevel: number;
}