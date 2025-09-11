import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = 'localhost';
const DB_PORT = 3307;
const DB_USER = process.env.MYSQL_USER;
const DB_PASS = process.env.MYSQL_ROOT_PASSWORD;
const DB_NAME = process.env.MYSQL_DB;

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'src/migrations');
console.log('Migrations directory:', MIGRATIONS_DIR);

async function waitForDb(maxRetries = 30, delayMs = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const conn = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
      });
      await conn.ping();
      await conn.end();
      return;
    } catch {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('Could not connect to the database within the time limit.');
}

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

async function ensureMigrationsTable(conn: mysql.Connection) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      checksum CHAR(64) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);
}

async function getAppliedMap(
  conn: mysql.Connection,
): Promise<Record<string, { checksum: string }>> {
  const [rows] = await conn.query(`SELECT filename, checksum FROM _migrations`);
  const map: Record<string, { checksum: string }> = {};
  for (const r of rows as any[]) {
    map[r.filename] = { checksum: r.checksum };
  }
  return map;
}

function readSqlFilesSorted(): Array<{
  filename: string;
  fullPath: string;
  sql: string;
  checksum: string;
}> {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  return files.map((filename) => {
    const fullPath = path.join(MIGRATIONS_DIR, filename);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const normalized = raw.replace(/\r\n/g, '\n');
    return { filename, fullPath, sql: normalized, checksum: sha256(normalized) };
  });
}

async function applyMigration(
  conn: mysql.Connection,
  m: { filename: string; sql: string; checksum: string },
) {
  await conn.beginTransaction();
  try {
    await conn.query(m.sql);
    await conn.execute(`INSERT INTO _migrations (filename, checksum) VALUES (?, ?)`, [
      m.filename,
      m.checksum,
    ]);
    await conn.commit();
    console.log(`✅ Applied: ${m.filename}`);
  } catch (err) {
    await conn.rollback();
    console.error(`❌ Failed: ${m.filename}`);
    throw err;
  }
}

async function main() {
  await waitForDb();

  // Create a connection that allows multipleStatements, good for simple .sql files with multiple commands.
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    multipleStatements: true,
  });

  try {
    await ensureMigrationsTable(conn);
    const applied = await getAppliedMap(conn);
    const files = readSqlFilesSorted();
    console.log(`Found ${files.length} migration files.`);

    for (const m of files) {
      const already = applied[m.filename];
      if (already) {
        if (already.checksum !== m.checksum) {
          throw new Error(
            `Migration "${m.filename}" have changed since last run. Create a new file (i.e. next number) instead.`,
          );
        }
        console.log(`↩︎ Skip (already applied): ${m.filename}`);
        continue;
      }
      await applyMigration(conn, m);
    }

    console.log('🎉 All migrations are up to date.');
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
