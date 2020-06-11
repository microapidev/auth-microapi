require("custom-env").env();

module.exports = {
  dbConfig: {
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_PASSWORD,
  },

  server: {
    port: process.env.PORT || 3000,
  },
};
