import "jsr:@std/dotenv/load";
import { listOfCommands } from "../../infrastructure/commands/index.ts";
import { Bot } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { retryWithBackoff } from "../../helpers/retryWithBackoff.ts";

type CommandMainInfo = {
  command: string;
  description: string;
};

// Create an instance of the `Bot` class and pass your bot token to it.
let bot: Bot;
try {
  const API_KEY = Deno.env.get("TELEGRAM_API_KEY") as string;
  bot = new Bot(API_KEY);
} catch (e) {
  throw new Error(`Cannot get TELERGAM_API_KEY env variable: ${e}`);
}

function safeApiCall<T>(fn: () => Promise<T>): Promise<T> {
  return retryWithBackoff(fn); // Retries 5 times with backoff
}

// Setting commands and its descriptions

const objectOfCommandsWithDescriptions: CommandMainInfo[] = [];

for (const command of listOfCommands) {
  objectOfCommandsWithDescriptions.push({
    command: command.getName(),
    description: command.getDescription(),
  });
}

await bot.api.setMyCommands(objectOfCommandsWithDescriptions);

// Registering listeners

for (const command of listOfCommands) {
  bot.command(command.getName(), async (ctx) => {
    const userQuery = ctx.message?.text || "";
    const replies = command.getReply(userQuery);
    for (const reply of replies) {
      switch (true) {
        case Boolean(reply?.text):
          await safeApiCall(() => ctx.reply(reply.text, {
            reply_parameters: { message_id: ctx.msg.message_id },
          }));
          break;
        case Boolean(reply?.image):
          await safeApiCall(() => ctx.replyWithPhoto(reply.image, {
            reply_parameters: { message_id: ctx.msg.message_id },
          }));
          break;
        default:
          console.warn("Unknown reply type:", reply);
      }
    }
  });
}

bot.catch((err) => {
  console.error("Bot error:", err);
});

bot.start();
