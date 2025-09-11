import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export const getDb = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: 'localhost',
      user: process.env.MYSQL_USER,
      port: 3306,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DB,
      connectionLimit: 10,
    });
  }

  return pool;
};
