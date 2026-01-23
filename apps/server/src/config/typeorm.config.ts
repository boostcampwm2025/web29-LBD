import 'dotenv/config';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
export default new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST') || 'localhost',
  port: configService.get('DB_PORT') || 3306,
  username: configService.get('DB_USERNAME') || 'boostcamp',
  password: configService.get('DB_PASSWORD') || 'boostcamp123',
  database: configService.get('DB_DATABASE') || 'boostcamp_dev',
  entities: ['dist/**/*.entity.js'],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'dist/migrations/*.js'
      : 'src/migrations/*.ts',
  ],
  synchronize: false,
  logging: true,
  charset: 'utf8mb4',
});
