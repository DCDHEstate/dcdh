import postgres from 'postgres';

let sql;

if (process.env.NODE_ENV === 'production') {
  sql = postgres(process.env.DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
    max: 10,
  });
} else {
  // Reuse connection across hot-reloads in dev to avoid exhausting the pool
  if (!global._sqlClient) {
    global._sqlClient = postgres(process.env.DATABASE_URL, {
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  sql = global._sqlClient;
}

export default sql;
