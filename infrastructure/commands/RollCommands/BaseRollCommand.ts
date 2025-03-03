import { BaseCommand } from "../BaseCommand.ts";
import type { AnswerType, ICommand } from "../types.ts";

interface IBaseRollCommand extends ICommand {
  edges: number;
}

export abstract class BaseRollCommand extends BaseCommand
  implements IBaseRollCommand {
  abstract edges: number;
  get description(): string {
    return `Roll a dice (1-${this.edges})`;
  }
  getReply(): AnswerType {
    const dice = Math.floor(Math.random() * this.edges) + 1;
    return { text: `You rolled ${dice}` };
  }
}
