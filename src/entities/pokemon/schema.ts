import mongoose, { Schema, Document } from 'mongoose';

export interface IPokemon extends Document {
  pokemonName: string;
  nickname: string;
  favorite: boolean;
  powerLevel: number;
}
const PokemonSchema: Schema = new Schema({
  pokemonName: { type: String, required: true },
  nickname: { type: String, required: true },
  favorite: { type: Boolean, default: false },
  powerLevel: { type: Number, required: true },
}, {
  timestamps: true
});

export default mongoose.model('Pokemon', PokemonSchema);