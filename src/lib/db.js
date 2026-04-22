import postgres from 'postgres';

let sql;

if (process.env.NODE_ENV === 'production') {
  sql = postgres(process.env.DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
    max: 10,
    prepare: false,
  });
} else {
  // Reuse connection across hot-reloads in dev to avoid exhausting the pool
  if (!global._sqlClient) {
    global._sqlClient = postgres(process.env.DATABASE_URL, {
      ssl: { rejectUnauthorized: false },
      max: 5,
      prepare: false,
    });
  }
  sql = global._sqlClient;
}

export default sql;
