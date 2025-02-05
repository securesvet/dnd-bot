import { BaseRollCommand } from "./BaseRollCommand.ts";

export class RollD20Command extends BaseRollCommand {
  name = "rolld20";
  override edges = 20;

  override getReply(_userQuery?: string): AnswerType[] {
    const dice = Math.floor(Math.random() * this.edges) + 1;
    if (dice === 20) {
      return [{ text: "Critical hit! You rolled 20!" }];
    }
    if (dice === 1) {
      return [{ text: "Critical miss! You rolled 1!" }];
    }
    return [{ text: `You rolled ${dice}` }];
  }
}
