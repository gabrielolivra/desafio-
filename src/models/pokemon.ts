import { Collection, Db, ObjectId } from 'mongodb';
import { connectDB } from '../helpers/database.ts/database.helper';
import { PaginatedResult, PaginationHelper, PaginationOptions } from '../helpers/pagination.helper';

let db: Db;
let collection: Collection;
connectDB().then(database => {
    db = database;
    collection = db.collection('pokemons');
});

export async function insertOne<T extends Document>(pokemon: T) {

    const result = await collection.insertOne(pokemon);
    return { ...pokemon, _id: result.insertedId };
}

export async function findById<T extends Document>(id: string): Promise<T | null> {
    return collection.findOne({ _id: new ObjectId(id) }) as Promise<T | null>;
}

export async function findAll<T extends Document>(
  options?: PaginationOptions
): Promise<PaginatedResult<T>> {
  return PaginationHelper.paginate<T>(
    async () => {
      const { limit, page, sort } = PaginationHelper.getPaginationOptions(options);
      const skip = PaginationHelper.getSkip(page, limit);
      
      return collection
          .find()
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .toArray() as unknown as Promise<T[]>;
    },
    async () => collection.countDocuments(),
    options
  );
}
export async function updateById<T extends Document>(id: string, update: Partial<T>): Promise<T | null> {
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return findById<T>(id);
}