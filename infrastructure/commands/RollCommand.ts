import { BaseCommand } from "./BaseCommand.ts";

export class RollCommand extends BaseCommand { 
   
    name: string = "roll";
    description: string = "Roll a dice (1-100)";

    getReply(_userQuery?: string): AnswerType[] {
        const dice = Math.floor(Math.random() * 100) + 1;
        return [{ text: `You rolled a ${dice}` }];
    }
}