import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaV31768285856362 implements MigrationInterface {
  name = 'SchemaV31768285856362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==============================================
    // 1. V1에서 생성된 불필요한 테이블 삭제
    // ==============================================
    await queryRunner.query(`DROP TABLE IF EXISTS \`cheetsheet_problem\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`cheetsheet\``);

    // ==============================================
    // 2. V2에서 생성된 불필요한 테이블 삭제
    // ==============================================
    await queryRunner.query(`DROP TABLE IF EXISTS \`field_validation\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`problem_field\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`diagram_template\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`cookbook_composition\``);

    // ==============================================
    // 3. V2에서 추가된 컬럼 제거 (V3에서 사용 안함)
    // ==============================================
    await queryRunner.query(
      `ALTER TABLE \`problem\` DROP COLUMN \`service_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` DROP COLUMN \`difficulty\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` DROP COLUMN \`estimated_time\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP COLUMN \`config_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP COLUMN \`config_info\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP COLUMN \`updated_at\``,
    );

    // ==============================================
    // 4. V3 새 컬럼 추가
    // ==============================================
    await queryRunner.query(
      `ALTER TABLE \`problem\` ADD \`required_fields\` json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD \`answer_config\` json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`password\` varchar(100) NOT NULL`,
    );

    // ==============================================
    // 5. Tag 테이블 생성
    // ==============================================
    await queryRunner.query(
      `CREATE TABLE \`tag\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(20) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_tag_name\` (\`name\`)
      ) ENGINE=InnoDB`,
    );

    // ==============================================
    // 6. cookbook, cookbook_problem 테이블 생성
    // ==============================================
    await queryRunner.query(
      `CREATE TABLE \`cookbook\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`description\` text NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `CREATE TABLE \`cookbook_problem\` (
        \`cookbook_id\` int NOT NULL,
        \`problem_id\` int NOT NULL,
        \`order_number\` int NOT NULL,
        PRIMARY KEY (\`cookbook_id\`, \`problem_id\`)
      ) ENGINE=InnoDB`,
    );

    // ==============================================
    // 7. problem_tag, cookbook_tag 중간 테이블 생성
    // ==============================================
    await queryRunner.query(
      `CREATE TABLE \`problem_tag\` (
        \`problem_id\` int NOT NULL,
        \`tag_id\` int NOT NULL,
        PRIMARY KEY (\`problem_id\`, \`tag_id\`)
      ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `CREATE TABLE \`cookbook_tag\` (
        \`cookbook_id\` int NOT NULL,
        \`tag_id\` int NOT NULL,
        PRIMARY KEY (\`cookbook_id\`, \`tag_id\`)
      ) ENGINE=InnoDB`,
    );

    // ==============================================
    // 8. FK 생성
    // ==============================================
    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\`
       ADD CONSTRAINT \`FK_cookbook_problem_cookbook\`
       FOREIGN KEY (\`cookbook_id\`) REFERENCES \`cookbook\`(\`id\`)
       ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\`
       ADD CONSTRAINT \`FK_cookbook_problem_problem\`
       FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\`(\`id\`)
       ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`problem_tag\`
       ADD CONSTRAINT \`FK_problem_tag_problem\`
       FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\`(\`id\`)
       ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`problem_tag\`
       ADD CONSTRAINT \`FK_problem_tag_tag\`
       FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`)
       ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\`
       ADD CONSTRAINT \`FK_cookbook_tag_cookbook\`
       FOREIGN KEY (\`cookbook_id\`) REFERENCES \`cookbook\`(\`id\`)
       ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\`
       ADD CONSTRAINT \`FK_cookbook_tag_tag\`
       FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`)
       ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback V3 changes
    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\` DROP FOREIGN KEY \`FK_cookbook_tag_tag\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\` DROP FOREIGN KEY \`FK_cookbook_tag_cookbook\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem_tag\` DROP FOREIGN KEY \`FK_problem_tag_tag\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem_tag\` DROP FOREIGN KEY \`FK_problem_tag_problem\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\` DROP FOREIGN KEY \`FK_cookbook_problem_problem\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\` DROP FOREIGN KEY \`FK_cookbook_problem_cookbook\``,
    );
    await queryRunner.query(`DROP TABLE \`cookbook_tag\``);
    await queryRunner.query(`DROP TABLE \`problem_tag\``);
    await queryRunner.query(`DROP TABLE \`cookbook_problem\``);
    await queryRunner.query(`DROP TABLE \`cookbook\``);
    await queryRunner.query(`DROP TABLE \`tag\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP COLUMN \`answer_config\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` DROP COLUMN \`required_fields\``,
    );
  }
}
