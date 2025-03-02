import { BaseRollCommand } from "./BaseRollCommand.ts";

export class RollCommand extends BaseRollCommand {
  get name(): string {
    return "roll";
  }
  edges: number = 100;
}
