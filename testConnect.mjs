import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();
const { Client } = pkg;

(async () => {
  const connStr = process.env.DATABASE_URL;
  console.log('[TEST] Using DATABASE_URL present:', Boolean(connStr));
  try {
    const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const res = await client.query("SELECT NOW() as now");
    console.log('[TEST] CONNECTED - server time:', res.rows[0].now);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('[TEST] ERROR', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
