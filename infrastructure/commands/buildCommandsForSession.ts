import type { BaseCommand } from "./BaseCommand.ts";
import { CheckCommand } from "./CheckCommand.ts";
import { HelloCommand } from "./HelloWorldCommand.ts";
import { RollCommand } from "./RollCommands/RollCommand.ts";
import { RollD20Command } from "./RollCommands/RollD20Command.ts";
import { StartCommand } from "./StartCommand.ts";
import { MemeCommand } from "./MemeCommand.ts";
import { MentionAllCommand } from "./MentionAllCommand.ts";
import type { IChat } from "../chat/chat.ts";

// Here session can mean two things: it's either a user or a group of users
export function buildCommandsForSession(chatInfo?: IChat): BaseCommand[] {
  const payload: IChat = chatInfo ?? {
    chatId: "svetid",
    username: "svet",
    firstName: "Svet",
    secondName: "Mur",
    userQuery: null,
    isGroup: false,
  };
  return [
    new HelloCommand(payload),
    new StartCommand(payload),
    new RollCommand(payload),
    new RollD20Command(payload),
    new CheckCommand(payload),
    new MemeCommand(payload),
    new MentionAllCommand(payload),
  ];
}
