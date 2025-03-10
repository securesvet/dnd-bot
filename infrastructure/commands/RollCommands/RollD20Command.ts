import { BaseRollCommand } from "./BaseRollCommand.ts";
import type { AnswerType } from "../types.ts";

export class RollD20Command extends BaseRollCommand {
  protected name = "rolld20";
  protected edges = 20;
  override getReply(): AnswerType {
    const dice = Math.floor(Math.random() * this.edges) + 1;
    if (dice === 20) {
      return { text: "Critical hit! 🎉 You rolled 20!" };
    }
    if (dice === 1) {
      return { text: "Critical miss! 😕 You rolled 1!" };
    }
    return { text: `You rolled ${dice}` };
  }
}
