const { MongoClient } = require('mongodb');
const { DB_URL } = require('./constants');

async function cleanDatabase() {
  const client = await MongoClient.connect(DB_URL);
  const db = client.db('coffee_test');

  try {
    // Get list of all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    // Clean each collection
    for (const collectionName of collectionNames) {
      await db.collection(collectionName).deleteMany({});
      console.log(`✅ Collection ${collectionName} cleaned`);
    }

    console.log('\n✅ Database cleaned successfully');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

cleanDatabase();
