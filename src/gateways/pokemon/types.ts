export interface IPokemonGatewayListResponse {
  id: number,
  name: string,
  height: number,
  weight: number,
  types: string[],
}

export interface IPokemonGatewayDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string; url: string } }[];
}