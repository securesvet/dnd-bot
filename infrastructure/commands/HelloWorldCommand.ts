import { BaseCommand } from "./BaseCommand.ts";
import type { AnswerType } from "./types.ts";

export class HelloCommand extends BaseCommand {
  public description = `Command greets the user`;
  public name = "hello";
  getReply(): AnswerType {
    return { text: `Hello, ${this.chatInfo.firstName}!` };
  }
}
