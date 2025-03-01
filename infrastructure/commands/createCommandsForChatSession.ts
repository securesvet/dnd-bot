import type { BaseCommand } from "./BaseCommand.ts";
import { CheckCommand } from "./CheckCommand.ts";
import { HelloWorldCommand } from "./HelloWorldCommand.ts";
import { RollCommand } from "./RollCommands/RollCommand.ts";
import { RollD20Command } from "./RollCommands/RollD20Command.ts";
import { StartCommand } from "./StartCommand.ts";
import { MemeCommand } from "./MemeCommand.ts";
import type { IChat } from "../chat/chat.ts";

// Here session can mean two things: it's either a user or a group of users
export function createCommandsForChatSession(chatInfo: IChat): BaseCommand[] {
  return [
    new StartCommand(chatInfo),
    new HelloWorldCommand(chatInfo),
    new RollCommand(chatInfo),
    new RollD20Command(chatInfo),
    new CheckCommand(chatInfo),
    new MemeCommand(chatInfo),
  ];
}
