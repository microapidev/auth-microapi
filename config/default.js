require("custom-env").env();

// parse DATABASE_URL if set in environment
let matchFound;
let db_user, db_password, db_host, db_port, db_name;

const db_url = process.env.DATABASE_URL;

const regex = /^(?:(?:[^:/?#\s]+):\/{2})([^@/?#\s]+):([^@/?#\s]+)@([^/?#\s]+):([^@/?#\s]+)(?:\/([^?#\s]*))?$/g;
if (db_url) matchFound = [...db_url.matchAll(regex)];

if (matchFound) {
  [, db_user, db_password, db_host, db_port, db_name] = matchFound[0];
}

module.exports = {
  dbConfig: {
    database: db_name || process.env.DB_NAME,
    port: db_port || process.env.DB_PORT,
    host: db_host || process.env.DB_HOST,
    password: db_password || process.env.DB_PASSWORD,
    user: db_user || process.env.DB_USER,
  },

  server: {
    port: process.env.PORT || 3000,
  },
};
