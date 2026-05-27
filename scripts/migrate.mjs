import { createClient } from '@vercel/postgres';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');
const envText = fs.readFileSync(envPath, 'utf8');
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)="?(.*?)"?$/i);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const conn = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL_UNPOOLED;
if (!conn) {
  console.error('Missing POSTGRES_URL_NON_POOLING in .env.local');
  process.exit(1);
}

const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
const sql = fs.readFileSync(schemaPath, 'utf8');

const client = createClient({ connectionString: conn });
await client.connect();
console.log('Connected to Neon, applying schema…');
await client.query(sql);
console.log('✓ Schema applied');
const { rows } = await client.query(`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`);
console.log('Tables:', rows.map(r => r.tablename).join(', '));
await client.end();
