# Neon Database Setup Guide

## Overview
This project uses **Neon** as the PostgreSQL database provider with **Prisma** as the ORM (Object-Relational Mapping).

## Prerequisites
- `.env` file with `DATABASE_URL` configured
- Prisma CLI installed (`npm install -D prisma`)
- Neon account and project created

## Getting Started

### 1. Set Up Your Neon Connection
1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project or select an existing one
3. Copy your PostgreSQL connection string
4. Add it to your `.env` file:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require&channel_binding=require"
```

### 2. Initialize Prisma (Already Done)
Your Prisma schema is located in `prisma/schema.prisma` with PostgreSQL configured.

### 3. Run Migrations

#### First Time Setup
```bash
npx prisma migrate dev --name init
```

This will:
- Create the initial database schema based on your `prisma/schema.prisma`
- Generate the Prisma Client
- Create a migration file in `prisma/migrations/`

#### Subsequent Migrations
After modifying your schema, run:
```bash
npx prisma migrate dev --name <migration_name>
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. View Database in Prisma Studio
```bash
npx prisma studio
```

## Configuration Files

### `.env` (Environment Variables)
```env
DATABASE_URL="your-neon-connection-string"
```

### `prisma.config.js` (Prisma Configuration)
```javascript
require('dotenv').config();

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
```

### `prisma/schema.prisma` (Database Schema)
Defines your database models, enums, and relationships.

## Using Prisma in Your Code

```typescript
import { prisma } from "@/lib/prisma";

// Example query
const users = await prisma.user.findMany();

// Create
const newUser = await prisma.user.create({
  data: {
    email: "user@example.com",
    name: "John Doe",
  },
});

// Update
await prisma.user.update({
  where: { id: 1 },
  data: { name: "Jane Doe" },
});

// Delete
await prisma.user.delete({
  where: { id: 1 },
});
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npx prisma migrate dev` | Create and apply migrations |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma studio` | Open Prisma Studio UI |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma db seed` | Seed database with initial data |

## Troubleshooting

### "datasource.url is required"
Make sure your `.env` file has `DATABASE_URL` set and `prisma.config.js` is loading it correctly.

### Connection refused
- Check that your Neon project is active
- Verify the connection string is correct
- Ensure your IP is whitelisted in Neon

### Schema validation errors
- Update your `prisma/schema.prisma` to match your changes
- Run `npx prisma migrate dev` to apply changes

## Resources
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Neon Documentation](https://neon.tech/docs/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
