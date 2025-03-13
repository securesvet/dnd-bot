import type { BaseCommand } from "./BaseCommand.ts";
import { CheckCommand } from "./CheckCommand.ts";
import { HelloCommand } from "./HelloWorldCommand.ts";
import { RollCommand } from "./RollCommands/RollCommand.ts";
import { RollD20Command } from "./RollCommands/RollD20Command.ts";
import { StartCommand } from "./StartCommand.ts";
import { MemeCommand } from "./MemeCommand.ts";
import { MentionAllCommand } from "./MentionAllCommand.ts";
import type { IChat } from "../chat/chat.ts";
import type { Database } from "../../db/Database.ts";

// Here session can mean two things: it's either a user or a group of users
export function buildCommandsForSession(
  { chatInfo, database }: { chatInfo: IChat; database: Database },
): BaseCommand[] {
  const payload = { chatInfo, database };
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
