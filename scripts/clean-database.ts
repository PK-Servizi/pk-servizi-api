import { AppDataSource } from '../src/config/data-source';

async function cleanDatabase() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();

    console.log('Dropping migrations table...');
    await AppDataSource.query('DROP TABLE IF EXISTS "migrations" CASCADE');

    console.log('✅ Database cleanup completed successfully');
    console.log('All tables including migrations table have been removed.');
  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

cleanDatabase();
