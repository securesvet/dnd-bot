import { BaseRollCommand } from "./BaseRollCommand.ts";

export class RollCommand extends BaseRollCommand {
  override edges: number = 100;
  protected override name: string = "roll";
}
