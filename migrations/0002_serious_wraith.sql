CREATE TABLE `drive_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`institution` text NOT NULL,
	`record_id` text NOT NULL,
	`course` text NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `drive_document_scope` ON `drive_documents` (`institution`,`course`);--> statement-breakpoint
CREATE TABLE `drive_grants` (
	`id` text PRIMARY KEY NOT NULL,
	`file` text NOT NULL,
	`member` text NOT NULL,
	`permission` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `drive_grant_slot` ON `drive_grants` (`file`,`member`);