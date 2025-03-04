import { BaseCommand } from "./BaseCommand.ts";
import type { AnswerType } from "./types.ts";

export class HelloCommand extends BaseCommand {
  protected description = `Command greets the user`;
  protected name = "hello";
  getReply(): AnswerType {
    return { text: `Hello, ${this.chatInfo.firstName}!` };
  }
}
