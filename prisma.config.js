const { defineConfig } = require('@prisma/config');
require('dotenv').config();

module.exports = defineConfig({
  earlyAccess: true,
  schema: {
    filePath: 'prisma/schema.prisma',
  },
  migrate: {
    datasourceUrl: process.env.DB_URL,
  },
});
