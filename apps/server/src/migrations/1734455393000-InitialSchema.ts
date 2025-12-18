import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1734455393000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // user 테이블
    await queryRunner.query(`
      CREATE TABLE \`user\` (
        \`id\` int PRIMARY KEY AUTO_INCREMENT,
        \`email\` varchar(255) UNIQUE NOT NULL,
        \`created_at\` datetime DEFAULT (CURRENT_TIMESTAMP),
        \`updated_at\` datetime DEFAULT (CURRENT_TIMESTAMP)
      )
    `);

    // solution 테이블
    await queryRunner.query(`
      CREATE TABLE \`solution\` (
        \`id\` int PRIMARY KEY AUTO_INCREMENT,
        \`config_type\` varchar(255),
        \`config_info\` JSON
      )
    `);

    // problem 테이블
    await queryRunner.query(`
      CREATE TABLE \`problem\` (
        \`id\` int PRIMARY KEY AUTO_INCREMENT,
        \`solution_id\` int,
        \`type\` ENUM ('sinario', 'unit', 'cheetsheet'),
        \`title\` varchar(255),
        \`description\` text NOT NULL,
        \`created_at\` datetime DEFAULT (CURRENT_TIMESTAMP),
        \`updated_at\` datetime DEFAULT (CURRENT_TIMESTAMP)
      )
    `);

    // cheetsheet 테이블
    await queryRunner.query(`
      CREATE TABLE \`cheetsheet\` (
        \`id\` int PRIMARY KEY AUTO_INCREMENT,
        \`title\` varchar(255),
        \`description\` text
      )
    `);

    // cheetsheet_problem 테이블
    await queryRunner.query(`
      CREATE TABLE \`cheetsheet_problem\` (
        \`cheetsheet_id\` int,
        \`problem_id\` int,
        \`problem_number\` int,
        PRIMARY KEY (\`cheetsheet_id\`, \`problem_id\`)
      )
    `);

    // related_problem 테이블
    await queryRunner.query(`
      CREATE TABLE \`related_problem\` (
        \`problem_id\` int,
        \`related_problem_id\` int,
        PRIMARY KEY (\`problem_id\`, \`related_problem_id\`)
      )
    `);

    // Foreign Keys
    await queryRunner.query(`
      ALTER TABLE \`problem\` 
      ADD FOREIGN KEY (\`solution_id\`) REFERENCES \`solution\`(\`id\`)
    `);

    await queryRunner.query(`
      ALTER TABLE \`related_problem\` 
      ADD FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\` (\`id\`)
    `);

    await queryRunner.query(`
      ALTER TABLE \`related_problem\` 
      ADD FOREIGN KEY (\`related_problem_id\`) REFERENCES \`problem\` (\`id\`)
    `);

    await queryRunner.query(`
      ALTER TABLE \`cheetsheet_problem\` 
      ADD FOREIGN KEY (\`cheetsheet_id\`) REFERENCES \`cheetsheet\` (\`id\`)
    `);

    await queryRunner.query(`
      ALTER TABLE \`cheetsheet_problem\` 
      ADD FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\` (\`id\`)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 롤백: 역순으로 삭제
    await queryRunner.query(`DROP TABLE IF EXISTS \`cheetsheet_problem\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`related_problem\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`cheetsheet\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`problem\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`solution\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`user\``);
  }
}
