CREATE UNIQUE INDEX gradebook_slot ON records (institution, json_extract(payload, '$.assignmentId'), json_extract(payload, '$.period')) WHERE kind = 'gradebook' AND deleted = 0;
--> statement-breakpoint
CREATE UNIQUE INDEX assignment_slot ON records (institution, course, json_extract(payload, '$.teacherId'), json_extract(payload, '$.subjectId')) WHERE kind = 'assignment' AND deleted = 0;
