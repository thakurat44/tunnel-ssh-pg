import 'dotenv/config';
import express from 'express';
import { queryPostgres } from './db-connection';

/**
 * App
 */
const app = express();

/**
 * Port
 */
const port = process.env.APP_PORT;

app.get('/health', async (req, res) => {
  const countQuery = `SELECT table_name, (SELECT n_live_tup FROM pg_stat_user_tables WHERE relname = table_name) AS row_count FROM information_schema.tables WHERE table_schema = 'public';`
  const result = await queryPostgres(countQuery)
  res.send(result);
});

app.listen(port, async () => {
  const query = `SELECT NOW()`
  const result = await queryPostgres(query)
  console.log(result)
  return console.log(`Express is listening at http://localhost:${port}`);
});
