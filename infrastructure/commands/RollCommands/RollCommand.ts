import { BaseRollCommand } from "./BaseRollCommand.ts";

export class RollCommand extends BaseRollCommand {
  public name = "roll";
  protected edges: number = 100;
}
