import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';

async function main() {
  console.log('Setting up the database...');

  // Run migrations
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });

  // Run seed script
  execSync('npm run prisma:seed', { stdio: 'inherit' });

  console.log('Database setup complete!');
}

main()
  .catch((e) => {
    console.error('Failed to setup database:', e);
    process.exit(1);
  }); 