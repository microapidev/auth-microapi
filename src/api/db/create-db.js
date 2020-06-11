const { Pool } = require("pg");
const pgtools = require("pgtools");
const debug = require("debug")("log");
const fs = require("fs").promises;
const path = require("path");

// if DB exists
const createDB = async (dbConfig) => {
  const pool = new Pool({
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    port: dbConfig.port,
  });

  const migrateFn = async () => {
    debug("Running migration ...");
    const sql = await fs.readFile(
      path.join(__dirname, "./sql/db-create.sql"),
      "utf8"
    );
    debug("SQL migration file read successfully");

    // reconnect client first
    const migrationClient = await pool.connect();

    await migrationClient.query(sql);
    await migrationClient.query(`
        INSERT INTO DB_VERSION (ID, VERSION)
        VALUES (1, 1.0)
        ON CONFLICT (ID) DO UPDATE SET VERSION = EXCLUDED.VERSION
      `);

    // do some seeding here maybe create an initial super-admin, admin and responder

    debug("Migration run succesfully");
    migrationClient.release();

    await pool.end();

    return "migratedDB";
  };

  debug("Checking for database ...");

  try {
    const client = await pool.connect();
    debug("Database found!");

    // check if migration has been run
    try {
      debug("Checking for initial migration ....");

      const result = await client.query(
        "select exists(select version from db_version where version >= 1) as migrated"
      );

      // Table exists check if it has any rows
      if (result.rows[0].migrated) {
        debug("Database has already been migrated");
        client.release();
        await pool.end();

        return "dbAlreadyMigrated";
      }
      // migration table is empty
      throw new Error("Error: DB exists but migration table is empty");
    } catch (error) {
      // release old connection
      client.release();

      if (error.message.includes('relation "db_version" does not exist')) {
        debug("Migration has not run yet. Attempting to run ...");
        try {
          await migrateFn();

          return "dbMigrated";
        } catch (err) {
          debug(err.message);
          debug("An error occured executing SQL file");

          throw err; // rethrow error to catch out there
        }
      } else {
        // rethrow error
        throw error;
      }
    }
  } catch (error) {
    debug(error.message);

    if (
      error.message.includes(`database "${dbConfig.database}" does not exist`)
    ) {
      debug("Database not found!");
      debug("Attempting to create DB ...");

      try {
        await pgtools.createdb(
          {
            user: dbConfig.user,
            host: dbConfig.host,
            password: dbConfig.password,
            port: dbConfig.port,
          },
          dbConfig.database
        );

        debug(`Database - ${dbConfig.database} created successfully`);

        // run migration
        await migrateFn();

        return "dbCreatedAndMigrated";
      } catch (err) {
        debug(err.message);
        throw err; // db creation failure
      }
    }
    pool.end(); // release connection to DB
    throw error; // throw the error for the external handler
  }
};

export default createDB;
