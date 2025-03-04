import { BaseCommand } from "./BaseCommand.ts";
import type { AnswerType } from "./types.ts";

export class MentionAllCommand extends BaseCommand {
  protected name = "all";
  protected description = "Command works in group chats, mention all users";
  getReply(): AnswerType {
    return { text: `@${this.chatInfo.username}` };
  }
}
