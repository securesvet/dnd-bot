/* Напоминание о том, что я хочу избежать импорт хелл, поэтому я пока что просто оставлю это здесь */

import type { BaseCommand } from "./BaseCommand.ts";
import HelloWorldCommand from "./HelloWorldCommand.ts";
import { RollCommand } from "./RollCommand.ts";

export const listOfCommands: BaseCommand[] = [
  new HelloWorldCommand(),
  new RollCommand(),
];
