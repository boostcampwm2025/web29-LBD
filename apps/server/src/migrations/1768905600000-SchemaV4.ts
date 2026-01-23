import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaV41768905600000 implements MigrationInterface {
  name = 'SchemaV41768905600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // problem.desc_detail 추가
    await queryRunner.query(`
      ALTER TABLE \`problem\`
      ADD COLUMN \`desc_detail\` text NOT NULL AFTER \`description\`
    `);

    // cookbook.desc_detail 추가
    await queryRunner.query(`
      ALTER TABLE \`cookbook\`
      ADD COLUMN \`desc_detail\` text NOT NULL AFTER \`description\`
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`cookbook\`
      DROP COLUMN \`desc_detail\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`problem\`
      DROP COLUMN \`desc_detail\`
    `);
  }
}
