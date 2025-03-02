import { BaseCommand } from "./BaseCommand.ts";

export class MentionAllCommand extends BaseCommand {
  get name(): string {
    return "all";
  }
  get description(): string {
    return "Command works in group chats, mention all users";
  }
  getReply(): AnswerType {
    return { text: `@${this.chatInfo.username}` };
  }
}
