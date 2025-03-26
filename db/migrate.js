const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const { DB_URL } = require('./constants');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function getMigrationStatus(db) {
  const appliedMigrations = await db
    .collection('migrations')
    .find({})
    .project({ name: 1, appliedAt: 1, description: 1 })
    .toArray();

  const migrationFiles = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.js'))
    .sort();

  return {
    applied: appliedMigrations.map(m => m.name),
    pending: migrationFiles
      .map(f => f.replace('.js', ''))
      .filter(f => !appliedMigrations.some(m => m.name === f)),
    all: migrationFiles.map(f => f.replace('.js', '')),
  };
}

async function applyMigration(db, file) {
  const migrationName = file.replace('.js', '');
  console.log(`Applying migration: ${migrationName}`);

  try {
    const migration = require(path.join(MIGRATIONS_DIR, file));
    await migration(db);

    await db.collection('migrations').insertOne({
      name: migrationName,
      appliedAt: new Date(),
      description: migration.description || 'No description provided',
    });

    console.log(`Migration ${migrationName} applied successfully`);
  } catch (error) {
    console.error(`Error applying migration ${migrationName}:`, error);
    throw error;
  }
}

async function applyMigrations() {
  const client = new MongoClient(DB_URL);

  try {
    await client.connect();
    const db = client.db('coffee_test');

    const { applied, pending } = await getMigrationStatus(db);

    if (pending.length === 0) {
      console.log('No pending migrations found');
      return;
    }

    console.log(`Found ${pending.length} pending migrations`);

    for (const file of pending.map(f => `${f}.js`)) {
      await applyMigration(db, file);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

async function showStatus() {
  const client = new MongoClient(DB_URL);

  try {
    await client.connect();
    const db = client.db('coffee_test');
    const status = await getMigrationStatus(db);

    console.log('\nMigration Status:');
    console.log('----------------');
    console.log(`Applied migrations: ${status.applied.length}`);
    console.log(`Pending migrations: ${status.pending.length}`);

    if (status.applied.length > 0) {
      console.log('\nApplied migrations:');
      status.applied.forEach(m => console.log(`- ${m}`));
    }

    if (status.pending.length > 0) {
      console.log('\nPending migrations:');
      status.pending.forEach(m => console.log(`- ${m}`));
    }
  } finally {
    await client.close();
  }
}

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case 'status':
    showStatus().catch(console.error);
    break;
  case 'migrate':
  default:
    applyMigrations().catch(console.error);
}
