CREATE TABLE `learningProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`uiLocale` varchar(20) NOT NULL DEFAULT 'es',
	`nativeLanguageCode` varchar(12) NOT NULL DEFAULT 'es',
	`targetLanguageCode` varchar(12) NOT NULL DEFAULT 'en',
	`learningGoal` varchar(32) NOT NULL DEFAULT 'everyday',
	`currentLevel` enum('A1','A2','B1','B2','C1','C2') NOT NULL DEFAULT 'A1',
	`recommendedLevel` enum('A1','A2','B1','B2','C1','C2'),
	`xp` int NOT NULL DEFAULT 0,
	`lessonsCompleted` int NOT NULL DEFAULT 0,
	`streakDays` int NOT NULL DEFAULT 0,
	`diagnosticCompleted` boolean NOT NULL DEFAULT false,
	`lastStudyAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learningProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `learningProfilesUserUnique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `lessonCompletions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` varchar(120) NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lessonCompletions_id` PRIMARY KEY(`id`),
	CONSTRAINT `lessonCompletionsUserLessonUnique` UNIQUE(`userId`,`lessonId`)
);
--> statement-breakpoint
CREATE TABLE `tutorRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`targetLanguageCode` varchar(12) NOT NULL,
	`level` varchar(2) NOT NULL,
	`goal` varchar(32) NOT NULL,
	`task` varchar(20) NOT NULL,
	`promptLength` int NOT NULL,
	`model` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tutorRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voiceAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` varchar(120) NOT NULL,
	`languageCode` varchar(12) NOT NULL,
	`storageKey` text NOT NULL,
	`transcript` text,
	`comparison` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voiceAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `lessonCompletionsUserCompletedIdx` ON `lessonCompletions` (`userId`,`completedAt`);--> statement-breakpoint
CREATE INDEX `tutorRequestsUserCreatedIdx` ON `tutorRequests` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `voiceAttemptsUserCreatedIdx` ON `voiceAttempts` (`userId`,`createdAt`);