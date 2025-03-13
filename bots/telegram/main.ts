import "jsr:@std/dotenv/load";
import { buildCommandsForSession } from "../../infrastructure/commands/buildCommandsForSession.ts";
import {
  Bot,
  type Context,
  MemorySessionStorage,
} from "https://deno.land/x/grammy@v1.35.0/mod.ts";
import {
  hydrateReply,
  parseMode,
} from "https://deno.land/x/grammy_parse_mode@1.11.1/mod.ts";
import type { ParseModeFlavor } from "https://deno.land/x/grammy_parse_mode@1.11.1/mod.ts";
import {
  chatMembers,
  type ChatMembersFlavor,
} from "https://deno.land/x/grammy_chat_members/mod.ts";
import type { ChatMember } from "https://deno.land/x/grammy@v1.35.0/types.ts";
import { Database } from "../../db/Database.ts";

type CommandMainInfo = {
  command: string;
  description: string;
};

// Create an instance of the `Bot` class and pass your bot token to it.
let bot: Bot<ParseModeFlavor<Context & ChatMembersFlavor>>;
try {
  const API_KEY = Deno.env.get("TELEGRAM_API_KEY") as string;
  bot = new Bot<ParseModeFlavor<Context & ChatMembersFlavor>>(API_KEY);
} catch (e) {
  throw new Error(`Cannot get TELEGRAM_API_KEY env variable: ${e}`);
}

// Install the plugin.
bot.use(hydrateReply);

// For accessing ChatMembers information
const adapter = new MemorySessionStorage<ChatMember>();

bot.use(chatMembers(adapter));

// Set the default parse mode for ctx.reply.
bot.api.config.use(parseMode("MarkdownV2"));

// Setting commands and its descriptions
const commands = buildCommandsForSession({
  chatInfo: {
    chatId: 0,
    username: "",
    firstName: "",
    secondName: "",
    userQuery: "",
    isGroup: false,
  },
  database: new Database(
    "postgres://postgres:samplepass@localhost:5432/telegram_bot",
  ),
});

// Set Telegram bot commands
const commandsPlaceholderWithDescription: CommandMainInfo[] = commands.map((
  command,
) => ({
  command: command.getName(),
  description: command.getDescription(),
}));

await bot.api.setMyCommands(commandsPlaceholderWithDescription);

const database = new Database(Deno.env.get("DATABASE_URL") as string);
await database.init();

bot.on("message", async (ctx) => {
  if (!ctx.from || !ctx.message?.text) return;

  // Build commands dynamically per user interaction
  const isGroup = ctx.chat.type === "group";
  const chatInfo = {
    chatId: ctx.from.id,
    username: ctx.from.username || "",
    firstName: ctx.from.first_name || "",
    secondName: ctx.from.last_name || "",
    userQuery: ctx.message.text,
    isGroup: isGroup,
    groupId: isGroup ? ctx.chat.id : undefined,
  };
  const userCommands = buildCommandsForSession({ chatInfo, database });

  /* ------ Database interaction ------ */

  // Check if the user is a new user, insert in a users table

  const isChatNew = await database.isGroupNew(ctx.chat.id);
  if (isChatNew) {
    database.insertNewGroup({
      group_id: ctx.chat.id,
      group_name: ctx.chat.title || "",
    });
  }

  const isUserNew = await database.isUserNew(ctx.from.id);
  if (isUserNew) {
    database.insertUser({
      chat_id: ctx.from.id,
      username: ctx.from.username || "",
      first_name: ctx.from.first_name || "",
      second_name: ctx.from.last_name || "",
    });
  }

  database.insertNewGroupMembers({
    group_id: ctx.chat.id,
    chat_id: ctx.from.id,
  });

  /* ------ User interaction ------ */

  // Find the command that matches the user input
  const userMessage = ctx.message.text.trim();
  const matchedCommand = userCommands.find((command) =>
    command.isValidCommand(userMessage)
  );

  if (matchedCommand) {
    const reply = await matchedCommand.getReply();

    switch (true) {
      case Boolean(reply.text):
        await ctx.replyWithHTML(reply.text as string, {
          reply_parameters: { message_id: ctx.msg.message_id },
        });
        break;
      case Boolean(reply.image):
        await ctx.replyWithPhoto(reply.image as string, {
          reply_parameters: { message_id: ctx.msg.message_id },
        });
        break;
      default:
        console.warn("Unknown reply type:", reply);
    }
  }
});

bot.catch((err) => {
  console.error("Bot error:", err);
});

bot.start({
  allowed_updates: ["message", "chat_member"],
});
