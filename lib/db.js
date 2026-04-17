// Postgres client wrapper. Uses @vercel/postgres when POSTGRES_URL is set,
// otherwise returns a stub that throws so callers can 503 gracefully.
import { sql as vercelSql } from '@vercel/postgres';

export function hasDb() {
  return !!process.env.POSTGRES_URL;
}

// Tagged-template passthrough. Throws a friendly error if DB isn't configured.
export function sql(strings, ...values) {
  if (!hasDb()) {
    const err = new Error('Postgres not configured (POSTGRES_URL missing)');
    err.code = 'DB_NOT_CONFIGURED';
    return Promise.reject(err);
  }
  return vercelSql(strings, ...values);
}
