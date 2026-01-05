import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaV21767508529080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========================================
    // Phase 1: 기존 FK 제거 및 테이블 수정
    // ========================================

    // problem 테이블의 solution_id FK 제거
    await queryRunner.query(`
      ALTER TABLE \`problem\`
      DROP FOREIGN KEY IF EXISTS \`FK_problem_solution\`
    `);

    // problem 테이블 수정
    // 1. type → problem_type 컬럼명 변경 및 ENUM 값 수정
    await queryRunner.query(`
      ALTER TABLE \`problem\`
      CHANGE COLUMN \`type\` \`problem_type\`
      ENUM('unit', 'cookbook', 'scenario') NOT NULL
    `);

    // 2. 새 컬럼 추가
    await queryRunner.query(`
      ALTER TABLE \`problem\`
      ADD COLUMN \`service_type\` varchar(50) NOT NULL AFTER \`problem_type\`,
      ADD COLUMN \`difficulty\` ENUM('beginner', 'intermediate', 'advanced') NOT NULL AFTER \`description\`,
      ADD COLUMN \`estimated_time\` int COMMENT '예상 소요 시간(분)' AFTER \`difficulty\`
    `);

    // 3. solution_id 컬럼 삭제 (관계 역전)
    await queryRunner.query(`
      ALTER TABLE \`problem\`
      DROP COLUMN \`solution_id\`
    `);

    // solution 테이블 수정
    await queryRunner.query(`
      ALTER TABLE \`solution\`
      ADD COLUMN \`problem_id\` int NOT NULL AFTER \`id\`,
      ADD COLUMN \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP AFTER \`config_info\`,
      ADD COLUMN \`updated_at\` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER \`created_at\`
    `);

    // cheetsheet 테이블 수정
    await queryRunner.query(`
      ALTER TABLE \`cheetsheet\`
      ADD COLUMN \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP AFTER \`description\`,
      ADD COLUMN \`updated_at\` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER \`created_at\`
    `);

    // ========================================
    // Phase 2: 새 테이블 생성
    // ========================================

    // cookbook_composition 테이블 생성
    await queryRunner.query(`
      CREATE TABLE \`cookbook_composition\` (
        \`id\` int PRIMARY KEY AUTO_INCREMENT,
        \`cookbook_id\` int NOT NULL COMMENT 'Cookbook 문제 ID',
        \`unit_problem_id\` int NOT NULL COMMENT '포함된 Unit 문제 ID',
        \`step_order\` int NOT NULL COMMENT '단계 순서',
        \`is_required\` boolean DEFAULT true,
        UNIQUE KEY \`unique_cookbook_step\` (\`cookbook_id\`, \`step_order\`)
      )
    `);

    // problem_field 테이블 생성
    await queryRunner.query(`
      CREATE TABLE \`problem_field\` (
        \`id\` int PRIMARY KEY AUTO_INCREMENT,
        \`problem_id\` int NOT NULL,
        \`field_order\` int NOT NULL COMMENT '필드 표시 순서',
        \`field_key\` varchar(100) NOT NULL COMMENT '프로그래밍 key',
        \`field_label\` varchar(255) NOT NULL COMMENT 'UI 라벨',
        \`ui_component\` ENUM('select', 'input', 'checkbox', 'radio', 'textarea', 'multi-select') NOT NULL,
        \`options\` JSON COMMENT 'select/radio 선택지',
        \`placeholder\` varchar(255),
        \`help_text\` text COMMENT '필드 설명',
        \`is_required\` boolean DEFAULT true,
        UNIQUE KEY \`unique_problem_field\` (\`problem_id\`, \`field_key\`)
      )
    `);

    // field_validation 테이블 생성
    await queryRunner.query(`
      CREATE TABLE \`field_validation\` (
        \`id\` int PRIMARY KEY AUTO_INCREMENT,
        \`field_id\` int NOT NULL,
        \`validation_type\` ENUM('exact', 'regex', 'graph', 'custom') NOT NULL,
        \`validation_config\` JSON NOT NULL COMMENT '검증 설정',
        \`success_message\` text,
        \`error_message\` text NOT NULL,
        \`hint\` text
      )
    `);

    // diagram_template 테이블 생성
    await queryRunner.query(`
      CREATE TABLE \`diagram_template\` (
        \`id\` int PRIMARY KEY AUTO_INCREMENT,
        \`service_type\` varchar(50) NOT NULL COMMENT '서비스 종류',
        \`layout_config\` JSON COMMENT 'React Flow 레이아웃 설정',
        \`node_rules\` JSON COMMENT '노드 생성 규칙',
        \`edge_rules\` JSON COMMENT '엣지 생성 규칙',
        UNIQUE KEY \`unique_service_template\` (\`service_type\`)
      )
    `);

    // ========================================
    // Phase 3: Foreign Key 추가
    // ========================================

    // solution.problem_id FK
    await queryRunner.query(`
      ALTER TABLE \`solution\`
      ADD CONSTRAINT \`FK_solution_problem\`
      FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\` (\`id\`) ON DELETE CASCADE
    `);

    // cookbook_composition FK
    await queryRunner.query(`
      ALTER TABLE \`cookbook_composition\`
      ADD CONSTRAINT \`FK_cookbook_composition_cookbook\`
      FOREIGN KEY (\`cookbook_id\`) REFERENCES \`problem\` (\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`cookbook_composition\`
      ADD CONSTRAINT \`FK_cookbook_composition_unit\`
      FOREIGN KEY (\`unit_problem_id\`) REFERENCES \`problem\` (\`id\`) ON DELETE CASCADE
    `);

    // problem_field FK
    await queryRunner.query(`
      ALTER TABLE \`problem_field\`
      ADD CONSTRAINT \`FK_problem_field_problem\`
      FOREIGN KEY (\`problem_id\`) REFERENCES \`problem\` (\`id\`) ON DELETE CASCADE
    `);

    // field_validation FK
    await queryRunner.query(`
      ALTER TABLE \`field_validation\`
      ADD CONSTRAINT \`FK_field_validation_field\`
      FOREIGN KEY (\`field_id\`) REFERENCES \`problem_field\` (\`id\`) ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ========================================
    // 롤백: 역순으로 삭제 및 복원
    // ========================================

    // Phase 1: FK 제거
    await queryRunner.query(`
      ALTER TABLE \`field_validation\`
      DROP FOREIGN KEY \`FK_field_validation_field\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`problem_field\`
      DROP FOREIGN KEY \`FK_problem_field_problem\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`cookbook_composition\`
      DROP FOREIGN KEY \`FK_cookbook_composition_unit\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`cookbook_composition\`
      DROP FOREIGN KEY \`FK_cookbook_composition_cookbook\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`solution\`
      DROP FOREIGN KEY \`FK_solution_problem\`
    `);

    // Phase 2: 새 테이블 삭제
    await queryRunner.query(`DROP TABLE IF EXISTS \`diagram_template\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`field_validation\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`problem_field\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`cookbook_composition\``);

    // Phase 3: 기존 테이블 원상복구

    // cheetsheet timestamps 제거
    await queryRunner.query(`
      ALTER TABLE \`cheetsheet\`
      DROP COLUMN \`updated_at\`,
      DROP COLUMN \`created_at\`
    `);

    // solution 테이블 원상복구
    await queryRunner.query(`
      ALTER TABLE \`solution\`
      DROP COLUMN \`updated_at\`,
      DROP COLUMN \`created_at\`,
      DROP COLUMN \`problem_id\`
    `);

    // problem 테이블 원상복구
    // 1. solution_id 컬럼 복원
    await queryRunner.query(`
      ALTER TABLE \`problem\`
      ADD COLUMN \`solution_id\` int AFTER \`id\`
    `);

    // 2. 추가 컬럼 제거
    await queryRunner.query(`
      ALTER TABLE \`problem\`
      DROP COLUMN \`estimated_time\`,
      DROP COLUMN \`difficulty\`,
      DROP COLUMN \`service_type\`
    `);

    // 3. problem_type → type 복원
    await queryRunner.query(`
      ALTER TABLE \`problem\`
      CHANGE COLUMN \`problem_type\` \`type\`
      ENUM('sinario', 'unit', 'cheetsheet')
    `);

    // 4. FK 복원
    await queryRunner.query(`
      ALTER TABLE \`problem\`
      ADD CONSTRAINT \`FK_problem_solution\`
      FOREIGN KEY (\`solution_id\`) REFERENCES \`solution\` (\`id\`)
    `);
  }
}
