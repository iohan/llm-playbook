import 'dotenv/config';
import { sql } from './db';

const users = [
  { name: 'Johan Östling', email: 'johan.ostling@gmail.com', role: 'admin' },
  { name: 'Jane Doe', email: 'john.doe@example.com', role: 'user' },
];

const providers = [{ providerName: 'Anthropic' }];

const models = [
  {
    modelName: 'Claude Sonnet 4',
    modelApiName: 'claude-sonnet-4-20250514',
    providerId: 1,
  },
  { modelName: 'Claude Haiku 3.5', modelApiName: 'claude-3-5-haiku-20241022', providerId: 1 },
  { modelName: 'Claude Opus 4.1', modelApiName: 'claude-opus-4-1-20250805', providerId: 1 },
];

const noExistingData = async (): Promise<boolean> => {
  const existingUsers = await sql('SELECT id FROM users LIMIT 1', {});
  if (existingUsers.length > 0) {
    return false;
  }
  const existingProviders = await sql('SELECT id FROM llm_providers LIMIT 1', {});
  if (existingProviders.length > 0) {
    return false;
  }

  const existingModels = await sql('SELECT id FROM llm_models LIMIT 1', {});
  if (existingModels.length > 0) {
    return false;
  }

  return true;
};

const seed = async () => {
  // The seed can only be run if the tables are empty
  if (!(await noExistingData())) {
    throw new Error('Cannot run seed, tables are not empty');
  }
  try {
    // USERS
    for (const user of users) {
      await sql('INSERT INTO users (name, email, role) VALUES (:name, :email, :role)', user);
    }

    // LLM providers
    for (const provider of providers) {
      await sql('INSERT INTO llm_providers (providerName) VALUES (:providerName)', provider);
    }

    // LLM models
    for (const model of models) {
      await sql(
        'INSERT INTO llm_models (modelName, modelApiName, providerId) VALUES (:modelName, :modelApiName, :providerId)',
        model,
      );
    }
  } catch (err) {
    console.error('Error when seeding data:', err);
    throw err;
  } finally {
    console.log('Seed completed');
    process.exit(0);
  }
};

seed().catch((err) => {
  console.error('db-seed failed:', err);
  process.exit(1);
});
