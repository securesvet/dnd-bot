import type { BaseCommand } from "./BaseCommand.ts";
import { CheckCommand } from "./CheckCommand.ts";
import HelloWorldCommand from "./HelloWorldCommand.ts";
import { RollCommand } from "./RollCommands/RollCommand.ts";
import { RollD20Command } from "./RollCommands/RollD20Command.ts";
import { StartCommand } from "./StartCommand.ts";
import { CreateMemeCommand } from "./CreateMemeCommand.ts";

export const listOfCommands: BaseCommand[] = [
  new StartCommand(),
  new HelloWorldCommand(),
  new RollCommand(),
  new RollD20Command(),
  new CheckCommand(),
  new CreateMemeCommand(),
];
