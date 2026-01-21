import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { seedProblems } from './problems.seed';
import { seedSolutions } from './solutions.seed';
import { seedCookbooks } from './cookbooks.seed';
import { config } from 'dotenv';
import * as path from 'path';

// .env.development 파일 로드 (typeorm.config.ts와 동일)
config({ path: '.env.development' });

// 기존 데이터 초기화
async function clearDatabase(dataSource: DataSource) {
  console.log('Clearing existing data...');
  await dataSource.query('SET FOREIGN_KEY_CHECKS=0');
  await dataSource.query('TRUNCATE TABLE cookbook_problem');
  await dataSource.query('TRUNCATE TABLE solution');
  await dataSource.query('TRUNCATE TABLE problem_tag');
  await dataSource.query('TRUNCATE TABLE problem');
  await dataSource.query('TRUNCATE TABLE cookbook_tag');
  await dataSource.query('TRUNCATE TABLE cookbook');
  await dataSource.query('TRUNCATE TABLE tag');
  await dataSource.query('SET FOREIGN_KEY_CHECKS=1');
  console.log('🗑️ Database cleared\n');
}

// 데이터 시딩
async function runSeeds() {
  // DataSource 초기화 (typeorm.config.ts와 동일한 설정)
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'boostcamp',
    password: process.env.DB_PASSWORD || 'boostcamp123',
    database: process.env.DB_DATABASE || 'cloudcraft',
    entities: [path.join(__dirname, '../entities/*.entity{.ts,.js}')],
    synchronize: false,
    logging: true,
    charset: 'utf8mb4',
  });

  try {
    console.log('Connecting to database...');
    await dataSource.initialize();
    console.log('Database connection established\n');

    // 기존 데이터 초기화
    await clearDatabase(dataSource);

    console.log('🌱 Starting seeding process...\n');

    // 순서대로 시드 실행
    console.log('1. Seeding problems...');
    await seedProblems(dataSource);

    console.log('\n2. Seeding solutions...');
    await seedSolutions(dataSource);

    console.log('\n3. Seeding cookbooks...');
    await seedCookbooks(dataSource);

    console.log('\n All seeds completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed');
  }
}

// 실행
void runSeeds();
