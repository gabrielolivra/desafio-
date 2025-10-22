export interface IPokemonGatewayListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        name: string;
        url: string;
    }[];
}

export interface IPokemonGatewayDetail {
    id: number;
    name: string;
    height: number;
    weight: number;
    abilities: { ability: { name: string; url: string } }[];
    types: { type: { name: string; url: string } }[];
}