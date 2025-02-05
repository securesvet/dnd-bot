import { BaseCommand } from "../BaseCommand.ts";

interface IBaseRollCommand extends ICommand {
    edges: number;
}

export abstract class BaseRollCommand extends BaseCommand implements IBaseRollCommand {
    abstract edges: number;
    override get description(): string {
        return `Roll a dice (1-${this.edges})`;
    }
    override getReply(_userQuery?: string): AnswerType[] {
        const dice = Math.floor(Math.random() * this.edges) + 1;
        return [{ text: `You rolled ${dice}` }];
    }
}
