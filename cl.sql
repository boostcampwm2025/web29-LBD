CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) UNIQUE NOT NULL,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `problem` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `solution_id` int,
  `type` ENUM ('sinario', 'unit', 'cheetsheet'),
  `title` varchar(255),
  `description` text NOT NULL,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `cheetsheet` (
  `id` int PRIMARY KEY,
  `title` varchar(255),
  `description` text
);

CREATE TABLE `cheetsheet_problem` (
  `cheetsheet_id` int,
  `problem_id` int,
  `problem_number` int
);

CREATE TABLE `related_problem` (
  `problem_id` int,
  `related_problem_id` int,
  PRIMARY KEY (`problem_id`, `related_problem_id`)
);

CREATE TABLE `solution` (
  `id` int PRIMARY KEY,
  `config_type` varchar(255),
  `config_info` JSON
);

ALTER TABLE `problem` ADD FOREIGN KEY (`id`) REFERENCES `related_problem` (`problem_id`);

ALTER TABLE `problem` ADD FOREIGN KEY (`id`) REFERENCES `related_problem` (`related_problem_id`);

ALTER TABLE `cheetsheet_problem` ADD FOREIGN KEY (`cheetsheet_id`) REFERENCES `cheetsheet` (`id`);

ALTER TABLE `cheetsheet_problem` ADD FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`);

ALTER TABLE `solution` ADD FOREIGN KEY (`id`) REFERENCES `problem` (`solution_id`);
