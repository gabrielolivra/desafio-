export interface IPokemonType {
  id: number,
  name: string,
  height: number,
  weight: number,
  types: string[],
}

export interface IPokemonGatewayListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface IPokemonGatewayDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string; url: string } }[];
}