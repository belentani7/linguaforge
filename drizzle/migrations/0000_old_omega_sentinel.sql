CREATE TABLE `diagnostics` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`target_language_code` varchar(12) NOT NULL,
	`learning_goal` varchar(40) NOT NULL,
	`recommended_level` varchar(4) NOT NULL,
	`average_score` int NOT NULL,
	`skill_count` int NOT NULL,
	`scores_json` json NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `diagnostics_id` PRIMARY KEY(`id`),
	CONSTRAINT `diagnostics_average_range` CHECK(`diagnostics`.`average_score` BETWEEN 0 AND 100),
	CONSTRAINT `diagnostics_skill_count_positive` CHECK(`diagnostics`.`skill_count` >= 3)
);
--> statement-breakpoint
CREATE TABLE `learner_profiles` (
	`user_id` varchar(36) NOT NULL,
	`native_language_code` varchar(12) NOT NULL DEFAULT 'es',
	`target_language_code` varchar(12) NOT NULL DEFAULT 'en',
	`learning_goal` varchar(40),
	`companion_goal` varchar(80),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learner_profiles_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `lesson_completions` (
	`user_id` varchar(36) NOT NULL,
	`lesson_id` varchar(80) NOT NULL,
	`best_score` int NOT NULL,
	`completed_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `lesson_completions_user_id_lesson_id_pk` PRIMARY KEY(`user_id`,`lesson_id`),
	CONSTRAINT `lesson_completions_score_range` CHECK(`lesson_completions`.`best_score` BETWEEN 0 AND 100)
);
--> statement-breakpoint
CREATE TABLE `project_submissions` (
	`user_id` varchar(36) NOT NULL,
	`project_id` varchar(80) NOT NULL,
	`artifact` text NOT NULL,
	`reflection` text NOT NULL,
	`status` enum('draft','completed') NOT NULL,
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `project_submissions_user_id_project_id_pk` PRIMARY KEY(`user_id`,`project_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`display_name` varchar(80) NOT NULL DEFAULT 'Estudiante',
	`time_zone` varchar(64) NOT NULL DEFAULT 'Europe/Madrid',
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_time_zone_not_empty` CHECK(char_length(`users`.`time_zone`) > 0)
);
--> statement-breakpoint
ALTER TABLE `diagnostics` ADD CONSTRAINT `diagnostics_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learner_profiles` ADD CONSTRAINT `learner_profiles_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lesson_completions` ADD CONSTRAINT `lesson_completions_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_submissions` ADD CONSTRAINT `project_submissions_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;