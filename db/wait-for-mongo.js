const { MongoClient } = require('mongodb');
const { DB_URL } = require('./constants');

async function waitForMongo() {
  console.log('Waiting for MongoDB to start...');

  let attempts = 0;
  const maxAttempts = 30;
  const delay = 1000;

  while (attempts < maxAttempts) {
    try {
      const client = await MongoClient.connect(DB_URL);
      await client.db('coffee_test').command({ ping: 1 });
      await client.close();

      console.log('\n✅ MongoDB is running and ready to accept connections!');
      console.log('Port: 27017');
      console.log('Database: coffee_test');
      console.log('User: admin');
      process.exit(0);
    } catch (error) {
      console.error(error);
      attempts++;
      if (attempts === maxAttempts) {
        console.error('\n❌ Failed to connect to MongoDB');
        console.error('Please check:');
        console.error('1. MongoDB is running');
        console.error('2. Port 27017 is available');
        console.error('3. Credentials are correct');
        console.error('4. MongoDB container is healthy');
        process.exit(1);
      }
      process.stdout.write('.');
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

waitForMongo().catch(console.error);
