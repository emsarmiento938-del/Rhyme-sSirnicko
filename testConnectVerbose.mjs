import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();
const { Client } = pkg;

(async () => {
  const connStr = process.env.DATABASE_URL;
  console.log('[VERBOSE TEST] Using DATABASE_URL present:', Boolean(connStr));
  console.log('[VERBOSE TEST] DATABASE_URL (masked):', connStr ? connStr.replace(/:(.*)@/, ':*****@') : '');

  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    statement_timeout: 10000
  });

  try {
    await client.connect();
    const res = await client.query("SELECT NOW() as now");
    console.log('[VERBOSE TEST] CONNECTED - server time:', res.rows[0].now);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('[VERBOSE TEST] ERROR - message:', err && err.message ? err.message : err);
    console.error('[VERBOSE TEST] ERROR - stack:', err && err.stack ? err.stack : 'no stack');
    process.exit(1);
  }
})();
