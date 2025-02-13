import { BaseRollCommand } from "./BaseRollCommand.ts";

export class RollCommand extends BaseRollCommand {
  name: string = "roll";
  edges: number = 100;
}
