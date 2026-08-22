CREATE TABLE `aiCoachRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`targetLanguageCode` varchar(8) NOT NULL,
	`task` enum('explain','practice','review') NOT NULL,
	`promptLength` int NOT NULL,
	`model` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiCoachRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `aiCoachRequestsUserCreatedAtIdx` ON `aiCoachRequests` (`userId`,`createdAt`);