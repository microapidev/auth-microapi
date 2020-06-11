import createDB from '../../src/api/db/create-db';

require('custom-env').env();
const dbConfig = require('config').get('dbConfig');
const pgtools = require('pgtools');
const { Pool } = require('pg');

beforeAll(async () => {
  try {
    await pgtools.dropdb(
      {
        user: dbConfig.user,
        host: dbConfig.host,
        password: dbConfig.password,
        port: dbConfig.port
      },
      dbConfig.database
    );
  } catch (error) {
    // do nothing
  }
});

describe('createDB function', () => {
  describe('Invalid connection parameters are provided', () => {
    it('should throw an error', async () => {
      const dummyConfig = {
        user: 'dummy',
        password: 'password',
        database: 'database',
        host: 'localhost',
        port: '4000'
      };

      await expect(createDB(dummyConfig)).rejects.toThrow();
    });
  });


  describe('Valid connection parameters', () => {
    describe('DB does not exist', () => {
      jest.setTimeout(15000);
      afterAll(async () => {
        await pgtools.dropdb(
          {
            user: dbConfig.user,
            host: dbConfig.host,
            password: dbConfig.password,
            port: dbConfig.port
          },
          dbConfig.database
        );
      });
      it('should create and migrate DB', async () => {
        await expect(createDB(dbConfig)).resolves.toBe('dbCreatedAndMigrated');
      });
    });

    describe('DB exists', () => {
      let pool;
      jest.setTimeout(15000);

      beforeAll(async () => {
        await createDB(dbConfig);
      });

      afterAll(async () => {
        await pgtools.dropdb(
          {
            user: dbConfig.user,
            host: dbConfig.host,
            password: dbConfig.password,
            port: dbConfig.port
          },
          dbConfig.database
        );
      });

      beforeEach(async () => {
        // drop DB_VERSION table
        pool = new Pool({
          user: dbConfig.user,
          host: dbConfig.host,
          database: dbConfig.database,
          password: dbConfig.password,
          port: dbConfig.port
        });
        try {
          await pool.query('DROP TABLE db_version;');
        } catch (err) {
          // do nothing
        }
      });

      it('no migration exists', async () => {
        // recreate public schema
        await pool.query('DROP SCHEMA public CASCADE;');
        await pool.query('CREATE SCHEMA public;');
        await pool.end();

        await expect(createDB(dbConfig)).resolves.toBe('dbMigrated');
      });

      it('migration has already run', async () => {
        const createSql = `
          CREATE TABLE public.DB_VERSION (
          VERSION numeric NOT NULL,
          ID smallint NOT NULL
          );`;
        const insertSql = 'INSERT INTO DB_VERSION(ID, VERSION) VALUES(1, 1.0);';

        await pool.query(createSql);
        await pool.query(insertSql);
        await pool.end();
        await expect(createDB(dbConfig)).resolves.toBe('dbAlreadyMigrated');
      });

      it('when db exists but has invalid migration', async () => {
        const createSql = `
          CREATE TABLE public.DB_VERSION (
          VERSION numeric NOT NULL,
          ID smallint NOT NULL
          );`;

        await pool.query(createSql);
        await pool.end();
        await expect(createDB(dbConfig)).rejects.toThrow();
      });
    });
  });
});
