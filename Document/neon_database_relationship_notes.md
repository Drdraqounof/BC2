# Neon Database Relationship Notes

## Table Relationships

The database uses a hierarchical relationship structure centered around task assignments. The **Task** model has a one-to-many relationship with **TaskAssignment**, allowing a single task to be assigned to multiple students. Similarly, the **Student** model has a one-to-many relationship with **TaskAssignment**, enabling each student to be assigned multiple tasks. The **TaskAssignment** model acts as a junction table, storing the assignment-specific data including completion status, grade, and timestamps, which bridges students and tasks together. This design allows teachers to track individual student progress on each task while maintaining clean separation of concerns between the core task definitions and student submissions.

---

# Migration Workflow Notes

The Prisma migration workflow with Neon involves three main steps: first, define or modify your data model in `schema.prisma` (e.g., adding new fields or tables), then run `npx prisma migrate dev --name <migration_name>` to create a timestamped migration file in the `prisma/migrations/` directory that captures the SQL changes. For safe testing in production-like environments, create a Neon branch before applying migrations, run the migration against that branch to validate changes, and only apply to the main branch after verification. Each migration is tracked in `migration_lock.toml` to prevent conflicts, and Prisma automatically runs `prisma generate` to update the Prisma client, ensuring your TypeScript types stay in sync with the database schema.
