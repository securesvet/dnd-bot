import { BaseCommand } from "./BaseCommand.ts";

export default class HelloWorldCommand extends BaseCommand {
  protected description: string = "Command greets the user";
  protected name: string = "hello";

  isValidTrigger(text: string): boolean {
    return text === this.getName();
  }
  getReply(_userQuery?: string): AnswerType[] {
    return [{ text: "Hello!" }];
  }
}
