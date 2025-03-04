import { BaseCommand } from "./BaseCommand.ts";
import type { AnswerType } from "./types.ts";

export class MentionAllCommand extends BaseCommand {
  public name = "all";
  public description = "Command works in group chats, mention all users";
  getReply(): AnswerType {
    return { text: `@${this.chatInfo.username}` };
  }
}
