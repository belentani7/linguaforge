CREATE TABLE `projectSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` varchar(120) NOT NULL,
	`artifact` text,
	`reflection` text,
	`status` enum('draft','completed') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectSubmissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `projectSubmissionsUserProjectUnique` UNIQUE(`userId`,`projectId`)
);
--> statement-breakpoint
CREATE INDEX `projectSubmissionsUserProjectUpdatedIdx` ON `projectSubmissions` (`userId`,`updatedAt`);