import "jsr:@std/dotenv/load";
import { listOfCommands } from "../../infrastructure/commands/listOfCommands.ts";
import { Bot, type Context } from "https://deno.land/x/grammy@v1.35.0/mod.ts";
import { safeApiCall } from "../../helpers/safeApiCall.ts";
import {
  hydrateReply,
  parseMode,
} from "https://deno.land/x/grammy_parse_mode@1.11.1/mod.ts";
import type { ParseModeFlavor } from "https://deno.land/x/grammy_parse_mode@1.11.1/mod.ts";

type CommandMainInfo = {
  command: string;
  description: string;
};

export type { CommandMainInfo };

// Create an instance of the `Bot` class and pass your bot token to it.
let bot: Bot<ParseModeFlavor<Context>>;
try {
  const API_KEY = Deno.env.get("TELEGRAM_API_KEY") as string;
  bot = new Bot<ParseModeFlavor<Context>>(API_KEY);
} catch (e) {
  throw new Error(`Cannot get TELERGAM_API_KEY env variable: ${e}`);
}

// Install the plugin.
bot.use(hydrateReply);

// Set the default parse mode for ctx.reply.
bot.api.config.use(parseMode("MarkdownV2"));

// Setting commands and its descriptions

const commandsWithDescription: CommandMainInfo[] = [];

for (const command of listOfCommands) {
  commandsWithDescription.push({
    command: command.name,
    description: command.description,
  });
}

await bot.api.setMyCommands(commandsWithDescription);

// Registering listeners

for (const command of listOfCommands) {
  bot.command(command.name, async (ctx) => {
    const userQuery = ctx.message?.text || "";
    command.userQuery = userQuery;
    const reply = await command.getReply();
    switch (true) {
      case Boolean(reply?.text):
        await safeApiCall(() =>
          ctx.replyWithHTML(reply.text, {
            reply_parameters: { message_id: ctx.msg.message_id },
          })
        );
        break;
      case Boolean(reply?.image):
        await safeApiCall(() =>
          ctx.replyWithPhoto(reply.image, {
            reply_parameters: { message_id: ctx.msg.message_id },
          })
        );
        break;
      default:
        console.warn("Unknown reply type:", reply);
    }
  });
}

bot.catch((err) => {
  console.error("Bot error:", err);
});

bot.start();
