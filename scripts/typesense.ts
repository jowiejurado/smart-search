import 'dotenv/config';
import Typesense from 'typesense';
import { collections } from './collections';

(async () => {
  const typesense = new Typesense.Client({
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY || 'xyz',
    nodes: [{
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || 'localhost',
      port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || '8108', 10),
      protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'http',
    }]
  });

  for (const collection of collections) {
    try {
      console.log(`Checking for existing collection: ${collection.name}`);
      await typesense.collections(collection.name).retrieve();
      
      console.log(`Deleting existing collection: ${collection.name}`);
      await typesense.collections(collection.name).delete();
    } catch (err) {
      console.warn(`Collection ${collection.name} does not exist or error occurred. Continuing...`);
    }
  }

  console.log('Creating collections...');
  
  for (const collection of collections) {
    console.log(`Creating schema for: ${collection.name}`);
    await typesense.collections().create(collection.schema as any);
  }

  console.log('Populating collections...');

  for (const collection of collections) {
    try {
      console.log(`Importing documents for: ${collection.name}`);
      const importResult = await typesense
        .collections(collection.name)
        .documents()
        .import(collection.data as any);

      console.log(`Import result for ${collection.name}:`, importResult);
    } catch (err) {
      console.error(`Error importing documents for ${collection.name}:`, err);
    }
  }
})();
