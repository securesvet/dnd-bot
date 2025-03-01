import { BaseCommand } from "./BaseCommand.ts";

export class HelloWorldCommand extends BaseCommand {
  description: string = "Command greets the user";
  name: string = "hello";

  public getReply(): AnswerType {
    return { text: "Hello!" };
  }
}
