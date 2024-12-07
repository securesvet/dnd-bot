import { BaseCommand } from "./BaseCommand.ts";

export default class HelloWorldCommand extends BaseCommand implements ICommand {
  isValidTrigger(text: string): boolean {
    return text === HelloWorldCommand.commandPrefix + 'hello';
  }
  getAnswer(): AnswerType[] {
    return [{
        text: 'Hello, world 1!',
        image: 'hello',
    }, {
        text: 'Hello, world 2!'
    }]
  }
}