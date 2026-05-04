if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("ENOENT")) {
      throw error;
    }
  }
}

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'node ./prisma/seed.ts',
  },
};