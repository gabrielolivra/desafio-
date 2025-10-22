import dotenv from 'dotenv';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/typeDefs/schema';
import { resolvers } from './graphql/resolvers/resolvers';

dotenv.config();

const app: Application = express();
const port = Number(process.env.PORT) || 3000;

export async function startServer() {
  const mongoUri = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@localhost:27017/${process.env.DATABASE}`;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  console.log('Connecting to MongoDB at', mongoUri);

  try {
    await mongoose.connect(mongoUri, { authSource: "admin" });
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app as any });

  app.listen(port, () => {
    console.log(`🤞 Server ready at http://localhost:${port}`);
    console.log(`🤞 GraphQL ready at http://localhost:${port}${apolloServer.graphqlPath}`);
  });
}