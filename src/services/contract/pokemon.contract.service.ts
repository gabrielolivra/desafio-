export interface IPokemonContract {
  id: string
  name: string
  height: number
  weight: number
  types: string[]
  nickname: string
  favorite: boolean
  powerLevel: number
}