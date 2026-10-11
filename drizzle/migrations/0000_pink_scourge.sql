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
	CONSTRAINT `diagnostics_id` PRIMARY KEY(`id`)
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
	CONSTRAINT `lesson_completions_user_id_lesson_id_pk` PRIMARY KEY(`user_id`,`lesson_id`)
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
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
