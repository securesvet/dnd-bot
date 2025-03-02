import { BaseCommand } from "./BaseCommand.ts";

export class HelloWorldCommand extends BaseCommand {
  get description(): string {
    return "Command greets the user";
  }
  get name(): string {
    return "hello";
  }
  getReply(): AnswerType {
    return { text: `Hello, ${this.chatInfo.firstName}!` };
  }
}
