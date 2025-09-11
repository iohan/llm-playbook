import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

const getDb = () => {
  if (!pool) {
    console.log(process.env.MYSQL_ROOT_PASSWORD);
    pool = mysql.createPool({
      host: 'localhost',
      user: process.env.MYSQL_USER,
      port: 3307,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DB,
      connectionLimit: 10,
      namedPlaceholders: true,
    });
  }

  return pool;
};

export async function sql<T = any>(q: string, params?: any): Promise<T[]> {
  const db = getDb();
  const [rows] = await db.execute(q, params);
  return rows as T[];
}

export async function insert(q: string, params?: any): Promise<{ insertId: number }> {
  const db = getDb();
  const [result] = await db.execute(q, params);
  const insertId = (result as mysql.ResultSetHeader).insertId;
  return { insertId };
}

export async function queryOne<T = any>(q: string, params?: any): Promise<T | null> {
  const db = getDb();
  const [rows] = await db.execute(q, params);
  const results = rows as T[];
  if (results?.length > 0) {
    return results[0] ?? null;
  }
  return null;
}
