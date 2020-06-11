import { Pool } from "pg";
const debug = require("debug")("log");
const config = require("config");

class DBConnection {
  async connect() {
    // connect to DB
    const dbConfig = config.get("dbConfig");

    try {
      this.pool = new Pool({
        user: dbConfig.user,
        host: dbConfig.host,
        database: dbConfig.database,
        password: dbConfig.password,
        port: dbConfig.port,
      });

      this.client = await this.pool.connect();
      debug("Connected to DB successfully");
    } catch (error) {
      debug("Error connecting to DB");
      throw error;
    }
  }

  async query(sql, params) {
    if (!this.pool) {
      await this.connect();
    }
    const result = await this.client.query(sql, params);
    return result.rows;
  }

  close() {
    if (this.pool) {
      this.pool.end();
    }
  }
}

const db = new DBConnection();

// export db connection
export default db;
