import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const client = new Client({
  user: "postgres",
  database: "test",
  hostname: "localhost",
  port: 5432,
});

await client.connect();
const result = await client.queryArray("SELECT ID, NAME FROM PEOPLE");
console.log(result.rows); // [[1, 'Carlos'], [2, 'John'], ...]
await client.end();