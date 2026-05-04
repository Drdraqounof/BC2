if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
