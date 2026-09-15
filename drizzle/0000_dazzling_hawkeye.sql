CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`institution` text NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`target` text NOT NULL,
	`detail` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_scope` ON `audit` (`institution`,`created`);--> statement-breakpoint
CREATE TABLE `connections` (
	`institution` text PRIMARY KEY NOT NULL,
	`account` text NOT NULL,
	`secret` text NOT NULL,
	`folder` text,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`year` text NOT NULL,
	`settings` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `institution_code` ON `institutions` (`code`);--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`institution` text NOT NULL,
	`user` text,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`status` text NOT NULL,
	`tutor_courses` text NOT NULL,
	FOREIGN KEY (`institution`) REFERENCES `institutions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `member_email` ON `members` (`institution`,`email`);--> statement-breakpoint
CREATE INDEX `member_user` ON `members` (`user`);--> statement-breakpoint
CREATE TABLE `oauth_states` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	`institution` text NOT NULL,
	`verifier` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`institution` text NOT NULL,
	`kind` text NOT NULL,
	`owner` text NOT NULL,
	`course` text,
	`payload` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`updated` text NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`institution`) REFERENCES `institutions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `record_scope` ON `records` (`institution`,`kind`,`deleted`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`expires` integer NOT NULL
);
