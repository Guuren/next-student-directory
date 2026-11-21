import mysql from 'mysql2/promise';
import { Student } from '@/types/student';

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

const pool =
  global._mysqlPool ||
  mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'student_db',
    ssl: {
      rejectUnauthorized: false,
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    idleTimeout: 10000,
    enableKeepAlive: true,
  });

if (process.env.NODE_ENV !== 'production') {
  global._mysqlPool = pool;
}

export default pool;

export async function getStudentsFromDatabase(): Promise<Student[]> {
  const [rows] = await pool.query(
    'SELECT id, student_id, student_name, section, email, mobile_number, social_media_link, profile_picture_url, created_at FROM students ORDER BY student_name ASC'
  );
  return rows as Student[];
}
