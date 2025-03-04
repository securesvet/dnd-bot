import { BaseCommand } from "../BaseCommand.ts";
import type { AnswerType } from "../types.ts";

export abstract class BaseRollCommand extends BaseCommand {
  protected abstract edges: number;
  get description(): string {
    return `Roll a dice (1-${this.edges})`;
  }
  getReply(): AnswerType {
    const dice = Math.floor(Math.random() * this.edges) + 1;
    return { text: `You rolled ${dice}` };
  }
}
