import "jsr:@std/dotenv/load";
import { createCommandsForChatSession } from "../../infrastructure/commands/createCommandsForChatSession.ts";
import {
  Bot,
  type Context,
  MemorySessionStorage,
} from "https://deno.land/x/grammy@v1.35.0/mod.ts";
import { safeApiCall } from "../../helpers/safeApiCall.ts";
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

type CommandMainInfo = {
  command: string;
  description: string;
};

export type { CommandMainInfo };

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
const userId = "svetid";
const userName = "Svet";
const commands = createCommandsForChatSession({
  chatId: userId,
  username: userName,
  firstName: "Svet",
  secondName: "Mur",
  userQuery: null,
});

// Set Telegram bot commands
const commandsPlaceholderWithDescription: CommandMainInfo[] = commands.map((
  command,
) => ({
  command: command.name,
  description: command.description,
}));

await bot.api.setMyCommands(commandsPlaceholderWithDescription);

bot.on("message", async (ctx) => {
  if (!ctx.from || !ctx.message?.text) return;

  // Create commands dynamically per user
  const userCommands = createCommandsForChatSession({
    chatId: ctx.chat.id.toString(),
    username: ctx.from.username || "",
    firstName: ctx.from.first_name || "",
    secondName: ctx.from.last_name || "",
    userQuery: ctx.message.text,
  });

  // Find the command that matches the user input
  const userMessage = ctx.message.text.trim();
  const matchedCommand = userCommands.find((command) => {
    const regex = new RegExp(`^/${command.name}(?:@\\w+)?\\s*`);
    return regex.test(userMessage);
  });

  if (matchedCommand) {
    const reply = await matchedCommand.getReply();

    switch (true) {
      case Boolean(reply.text):
        await safeApiCall(() =>
          ctx.replyWithHTML(reply.text as string, {
            reply_parameters: { message_id: ctx.msg.message_id },
          })
        );
        break;
      case Boolean(reply.image):
        await safeApiCall(() =>
          ctx.replyWithPhoto(reply.image as string, {
            reply_parameters: { message_id: ctx.msg.message_id },
          })
        );
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
