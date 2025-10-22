export interface IPokemonGatewayListResponse {
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
    abilities: { ability: { name: string; url: string } }[];
    types: { type: { name: string; url: string } }[];
}