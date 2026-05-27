import { createClient } from '@vercel/postgres';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)="?(.*?)"?$/i);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const client = createClient({ connectionString: process.env.POSTGRES_URL_NON_POOLING });
await client.connect();

console.log('1. Keep newest brief per order_id, delete older duplicates…');
const del = await client.query(`
  DELETE FROM briefs
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY created_at DESC) AS rn
      FROM briefs
    ) s WHERE rn > 1
  )
`);
console.log(`  Deleted ${del.rowCount} duplicate briefs`);

console.log('2. Add UNIQUE constraint on briefs.order_id…');
await client.query(`ALTER TABLE briefs ADD CONSTRAINT briefs_order_id_unique UNIQUE (order_id)`).catch(e => {
  if (/already exists|duplicate/.test(e.message)) console.log('  Constraint already exists, skipping');
  else throw e;
});

console.log('✓ Done');
await client.end();
