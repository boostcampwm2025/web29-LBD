import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaV51769615509306 implements MigrationInterface {
  name = 'SchemaV51769615509306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_solution_problem\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\` DROP FOREIGN KEY \`FK_cookbook_problem_cookbook\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\` DROP FOREIGN KEY \`FK_cookbook_problem_problem\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem_tag\` DROP FOREIGN KEY \`FK_problem_tag_problem\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem_tag\` DROP FOREIGN KEY \`FK_problem_tag_tag\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`related_problem\` DROP FOREIGN KEY \`related_problem_ibfk_1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`related_problem\` DROP FOREIGN KEY \`related_problem_ibfk_2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\` DROP FOREIGN KEY \`FK_cookbook_tag_cookbook\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\` DROP FOREIGN KEY \`FK_cookbook_tag_tag\``,
    );
    await queryRunner.query(`DROP INDEX \`email\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`UQ_tag_name\` ON \`tag\``);
    await queryRunner.query(
      `DROP INDEX \`related_problem_id\` ON \`related_problem\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` ADD \`fixed_options\` json NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`created_at\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` CHANGE \`problem_id\` \`problem_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD UNIQUE INDEX \`IDX_bf64cb1bb965b24b4b8e1b71b6\` (\`problem_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` CHANGE \`title\` \`title\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` CHANGE \`desc_detail\` \`desc_detail\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tag\` ADD UNIQUE INDEX \`IDX_6a9775008add570dc3e5a0bab7\` (\`name\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_bf64cb1bb965b24b4b8e1b71b6\` ON \`solution\` (\`problem_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_9807ebbd56c114c84f1e50cbb5\` ON \`problem_tag\` (\`problem_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_41bfc0e7b8632b69e7154f2b97\` ON \`problem_tag\` (\`tag_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_5f607f8f83b7d4be18df1ec5cb\` ON \`related_problem\` (\`problem_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_90fbbf944326dfaea5586bc922\` ON \`related_problem\` (\`related_problem_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_ae06a784afbeb68af02d9bdbe5\` ON \`cookbook_tag\` (\`cookbook_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_3fa56d59ed5ca04a85ddc228b2\` ON \`cookbook_tag\` (\`tag_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_bf64cb1bb965b24b4b8e1b71b68\` FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\` ADD CONSTRAINT \`FK_d989ccc1bae14f77d4c728b9d63\` FOREIGN KEY (\`cookbook_id\`) REFERENCES \`cookbook\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\` ADD CONSTRAINT \`FK_a06db1e83d1a9243c70a8deeb39\` FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem_tag\` ADD CONSTRAINT \`FK_9807ebbd56c114c84f1e50cbb57\` FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem_tag\` ADD CONSTRAINT \`FK_41bfc0e7b8632b69e7154f2b974\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`related_problem\` ADD CONSTRAINT \`FK_5f607f8f83b7d4be18df1ec5cbf\` FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`related_problem\` ADD CONSTRAINT \`FK_90fbbf944326dfaea5586bc922e\` FOREIGN KEY (\`related_problem_id\`) REFERENCES \`problem\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\` ADD CONSTRAINT \`FK_ae06a784afbeb68af02d9bdbe5e\` FOREIGN KEY (\`cookbook_id\`) REFERENCES \`cookbook\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\` ADD CONSTRAINT \`FK_3fa56d59ed5ca04a85ddc228b2d\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\` DROP FOREIGN KEY \`FK_3fa56d59ed5ca04a85ddc228b2d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\` DROP FOREIGN KEY \`FK_ae06a784afbeb68af02d9bdbe5e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`related_problem\` DROP FOREIGN KEY \`FK_90fbbf944326dfaea5586bc922e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`related_problem\` DROP FOREIGN KEY \`FK_5f607f8f83b7d4be18df1ec5cbf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem_tag\` DROP FOREIGN KEY \`FK_41bfc0e7b8632b69e7154f2b974\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem_tag\` DROP FOREIGN KEY \`FK_9807ebbd56c114c84f1e50cbb57\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\` DROP FOREIGN KEY \`FK_a06db1e83d1a9243c70a8deeb39\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\` DROP FOREIGN KEY \`FK_d989ccc1bae14f77d4c728b9d63\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_bf64cb1bb965b24b4b8e1b71b68\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3fa56d59ed5ca04a85ddc228b2\` ON \`cookbook_tag\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ae06a784afbeb68af02d9bdbe5\` ON \`cookbook_tag\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_90fbbf944326dfaea5586bc922\` ON \`related_problem\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5f607f8f83b7d4be18df1ec5cb\` ON \`related_problem\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_41bfc0e7b8632b69e7154f2b97\` ON \`problem_tag\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9807ebbd56c114c84f1e50cbb5\` ON \`problem_tag\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_bf64cb1bb965b24b4b8e1b71b6\` ON \`solution\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tag\` DROP INDEX \`IDX_6a9775008add570dc3e5a0bab7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` ADD \`updated_at\` datetime(0) NULL DEFAULT 'now()'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` ADD \`created_at\` datetime(0) NULL DEFAULT 'now()'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` CHANGE \`desc_detail\` \`desc_detail\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` CHANGE \`title\` \`title\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP INDEX \`IDX_bf64cb1bb965b24b4b8e1b71b6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` CHANGE \`problem_id\` \`problem_id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`updated_at\` datetime(0) NULL DEFAULT 'now()'`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`created_at\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`created_at\` datetime(0) NULL DEFAULT 'now()'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem\` DROP COLUMN \`fixed_options\``,
    );
    await queryRunner.query(
      `CREATE INDEX \`related_problem_id\` ON \`related_problem\` (\`related_problem_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`UQ_tag_name\` ON \`tag\` (\`name\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`email\` ON \`user\` (\`email\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\` ADD CONSTRAINT \`FK_cookbook_tag_tag\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_tag\` ADD CONSTRAINT \`FK_cookbook_tag_cookbook\` FOREIGN KEY (\`cookbook_id\`) REFERENCES \`cookbook\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`related_problem\` ADD CONSTRAINT \`related_problem_ibfk_2\` FOREIGN KEY (\`related_problem_id\`) REFERENCES \`problem\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`related_problem\` ADD CONSTRAINT \`related_problem_ibfk_1\` FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem_tag\` ADD CONSTRAINT \`FK_problem_tag_tag\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`problem_tag\` ADD CONSTRAINT \`FK_problem_tag_problem\` FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\` ADD CONSTRAINT \`FK_cookbook_problem_problem\` FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cookbook_problem\` ADD CONSTRAINT \`FK_cookbook_problem_cookbook\` FOREIGN KEY (\`cookbook_id\`) REFERENCES \`cookbook\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_solution_problem\` FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
