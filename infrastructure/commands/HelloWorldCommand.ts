import { BaseCommand } from "./BaseCommand.ts";

export default class HelloWorldCommand extends BaseCommand {
  protected description: string = "Command greets the user";
  protected name: string = "hello";

  public getReply(_userQuery?: string): AnswerType[] {
    return [{ text: "Hello!" }];
  }
}
