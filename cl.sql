-- ========================================
-- CloudCraft Database Schema V2
-- AWS 학습 플랫폼 데이터베이스 스키마
-- ========================================

-- ========================================
-- 기본 테이블
-- ========================================

-- 사용자 테이블
CREATE TABLE `user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) UNIQUE NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 문제 테이블
CREATE TABLE `problem` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `problem_type` ENUM('unit', 'cookbook', 'scenario') NOT NULL COMMENT '문제 유형',
  `service_type` varchar(50) NOT NULL COMMENT 'AWS 서비스 종류 (ec2, s3, vpc 등)',
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `difficulty` ENUM('beginner', 'intermediate', 'advanced') NOT NULL COMMENT '난이도',
  `estimated_time` int COMMENT '예상 소요 시간(분)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 솔루션 테이블
CREATE TABLE `solution` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `problem_id` int NOT NULL,
  `config_type` varchar(50) NOT NULL COMMENT '설정 유형',
  `config_info` JSON NOT NULL COMMENT '전체 정답 구성',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 치트시트 테이블
CREATE TABLE `cheetsheet` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- Cookbook/Unit 구조 테이블
-- ========================================

-- Cookbook 문제 구성 테이블
CREATE TABLE `cookbook_composition` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `cookbook_id` int NOT NULL COMMENT 'Cookbook 문제 ID',
  `unit_problem_id` int NOT NULL COMMENT '포함된 Unit 문제 ID',
  `step_order` int NOT NULL COMMENT '단계 순서',
  `is_required` boolean DEFAULT true COMMENT '필수 단계 여부',
  UNIQUE KEY `unique_cookbook_step` (`cookbook_id`, `step_order`)
);

-- 문제 입력 필드 테이블
CREATE TABLE `problem_field` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `problem_id` int NOT NULL,
  `field_order` int NOT NULL COMMENT '필드 표시 순서',
  `field_key` varchar(100) NOT NULL COMMENT '프로그래밍 key (예: instanceType)',
  `field_label` varchar(255) NOT NULL COMMENT 'UI 라벨 (예: 인스턴스 타입)',
  `ui_component` ENUM('select', 'input', 'checkbox', 'radio', 'textarea', 'multi-select') NOT NULL,
  `options` JSON COMMENT 'select/radio의 선택지 배열',
  `placeholder` varchar(255),
  `help_text` text COMMENT '필드 설명',
  `is_required` boolean DEFAULT true,
  UNIQUE KEY `unique_problem_field` (`problem_id`, `field_key`)
);

-- 필드 검증 테이블
CREATE TABLE `field_validation` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `field_id` int NOT NULL,
  `validation_type` ENUM('exact', 'regex', 'graph', 'custom') NOT NULL COMMENT '검증 타입',
  `validation_config` JSON NOT NULL COMMENT '검증 설정',
  `success_message` text,
  `error_message` text NOT NULL,
  `hint` text COMMENT '힌트'
);

-- ========================================
-- 다이어그램 관련 테이블
-- ========================================

-- 다이어그램 템플릿 테이블 (선택적)
CREATE TABLE `diagram_template` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `service_type` varchar(50) NOT NULL COMMENT '서비스 종류',
  `layout_config` JSON COMMENT 'React Flow 레이아웃 설정',
  `node_rules` JSON COMMENT '노드 생성 규칙',
  `edge_rules` JSON COMMENT '엣지 생성 규칙',
  UNIQUE KEY `unique_service_template` (`service_type`)
);

-- ========================================
-- 기존 관계 테이블 (유지)
-- ========================================

-- 치트시트-문제 매핑 테이블
CREATE TABLE `cheetsheet_problem` (
  `cheetsheet_id` int,
  `problem_id` int,
  `problem_number` int COMMENT '치트시트 내 문제 순서',
  PRIMARY KEY (`cheetsheet_id`, `problem_id`)
);

-- 관련 문제 매핑 테이블
CREATE TABLE `related_problem` (
  `problem_id` int,
  `related_problem_id` int,
  PRIMARY KEY (`problem_id`, `related_problem_id`)
);

-- ========================================
-- Foreign Key 제약 조건
-- ========================================

-- solution FK
ALTER TABLE `solution`
  ADD CONSTRAINT `FK_solution_problem`
  FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE;

-- cookbook_composition FK
ALTER TABLE `cookbook_composition`
  ADD CONSTRAINT `FK_cookbook_composition_cookbook`
  FOREIGN KEY (`cookbook_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE;

ALTER TABLE `cookbook_composition`
  ADD CONSTRAINT `FK_cookbook_composition_unit`
  FOREIGN KEY (`unit_problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE;

-- problem_field FK
ALTER TABLE `problem_field`
  ADD CONSTRAINT `FK_problem_field_problem`
  FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE;

-- field_validation FK
ALTER TABLE `field_validation`
  ADD CONSTRAINT `FK_field_validation_field`
  FOREIGN KEY (`field_id`) REFERENCES `problem_field` (`id`) ON DELETE CASCADE;

-- related_problem FK
ALTER TABLE `related_problem`
  ADD CONSTRAINT `FK_related_problem_problem`
  FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE;

ALTER TABLE `related_problem`
  ADD CONSTRAINT `FK_related_problem_related`
  FOREIGN KEY (`related_problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE;

-- cheetsheet_problem FK
ALTER TABLE `cheetsheet_problem`
  ADD CONSTRAINT `FK_cheetsheet_problem_cheetsheet`
  FOREIGN KEY (`cheetsheet_id`) REFERENCES `cheetsheet` (`id`) ON DELETE CASCADE;

ALTER TABLE `cheetsheet_problem`
  ADD CONSTRAINT `FK_cheetsheet_problem_problem`
  FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE;
