import { BaseCommand } from "../BaseCommand.ts";
import type { AnswerType } from "../types.ts";

export class MentionAllCommand extends BaseCommand {
  protected name = "/unsuball";
  protected description =
    "Command works in group chats. Do not mention when /all is used";
  async getReply(): Promise<AnswerType> {
    if (!this.chatInfo.groupId) {
      console.error("This command is only available in group chats");
      return { text: "This command is only available in group chats" };
    }
    console.log(this.chatInfo.groupId);
    const users = await this.database.getUsersByGroupId(this.chatInfo.groupId);
    console.log(users);
    if (users === undefined) {
      console.error("No users found");
      return { text: "No users found in this chat" };
    }
    return {
      text:
        `You have successfully unsubscribed from /all, to resubscribe use /suball`,
    };
  }
}
