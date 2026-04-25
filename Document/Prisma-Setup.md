# Prisma Setup Documentation

## Overview
This document outlines the Prisma ORM setup process for the BC2 project and all commands executed during the setup.

## Setup Journey

### Initial Setup Attempt
Started with Prisma already configured in the project (`prisma/` folder exists). The project uses PostgreSQL (Neon) as the database.

### Issues Encountered & Resolution

#### Issue 1: Missing @prisma/client
**Problem:** `npx prisma generate` failed with: "Could not resolve @prisma/client"

**Resolution:**
- Attempted multiple install methods
- Final working approach:
  1. Removed old CLI package: `npm uninstall @prisma/cli`
  2. Installed new CLI: `npm install prisma --save-dev`
  3. Installed client: `npm install @prisma/client`
  4. Generated client successfully

#### Issue 2: Missing datasource.url in schema
**Problem:** `npx prisma migrate dev --name init` failed with: "The datasource.url property is required"

**Resolution:**
- Updated `prisma/schema.prisma`
- Changed:
  ```prisma
  datasource db {
    provider = "postgresql"
  }
  ```
- To:
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```

### Database Configuration
- **Provider:** PostgreSQL (via Neon)
- **Environment Variable:** `DATABASE_URL` in `.env`
- **Connection String Format:** `postgresql://user:password@host/database?sslmode=require&channel_binding=require`

---

## Prisma Commands Executed

### Installation & Setup
```bash
# Install new Prisma CLI (replaces deprecated @prisma/cli)
npm install prisma --save-dev

# Install Prisma Client library
npm install @prisma/client

# Remove old CLI package (deprecated)
npm uninstall @prisma/cli
```

### Code Generation
```bash
# Generate Prisma Client (after schema changes)
npx prisma generate
```

### Database Migrations
```bash
# Create and apply migrations (with interactive prompts)
npx prisma migrate dev --name init
```

### Development Tools
```bash
# View & manage database data via GUI
npx prisma studio

# Format schema file
npx prisma format

# Validate schema syntax
npx prisma validate

# View migration status
npx prisma migrate status

# Create migration without applying
npx prisma migrate dev --name <name> --create-only

# Reset database (drops all data, re-runs migrations)
npx prisma migrate reset
```

### Production Deployment
```bash
# Apply existing migrations to production
npx prisma migrate deploy

# Generate updated Prisma Client
npx prisma generate
```

---

## Key Files

- **Schema:** `prisma/schema.prisma` - Defines data models and database configuration
- **Migrations:** `prisma/migrations/` - Contains all database migration files
- **Environment:** `.env` - Contains `DATABASE_URL` connection string
- **Generated Client:** `node_modules/@prisma/client` - Auto-generated client library

---

## Current Status

✅ Prisma Client successfully generated (v7.8.0)
✅ Database datasource configured
⏳ Database migrations pending (awaiting `npx prisma migrate dev` completion)

## Next Steps

1. Run `npx prisma migrate dev --name init` to create initial database tables
2. Use `npx prisma studio` to verify database structure
3. Begin using Prisma Client in application code:
   ```typescript
   import { PrismaClient } from '@prisma/client'
   const prisma = new PrismaClient()
   ```

---

## Resources
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Client Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Neon PostgreSQL Provider](https://www.prisma.io/docs/reference/database-reference/supported-databases)
