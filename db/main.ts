import "jsr:@std/dotenv/load";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// Load environment variables (make sure you have a .env file)
const DATABASE_URL: string = Deno.env.get("DATABASE_URL") ||
  "postgres://bot_user:yourpassword@localhost:5432/telegram_bot";

const client: Client = new Client(DATABASE_URL);

export async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Failed to connect to PostgreSQL", error);
  }
}

export { client };
