import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';

const typeDefs = loadFilesSync<string>(path.join(__dirname, '*.graphql'));

export default typeDefs;