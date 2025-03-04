import { BaseRollCommand } from "./BaseRollCommand.ts";

export class RollCommand extends BaseRollCommand {
  protected name = "roll";
  protected edges: number = 100;
}
