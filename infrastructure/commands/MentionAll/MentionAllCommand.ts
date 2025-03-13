import { BaseCommand } from "../BaseCommand.ts";
import type { AnswerType } from "../types.ts";

export class MentionAllCommand extends BaseCommand {
  protected name = "all";
  protected description = "Command works in group chats, mention all users";
  async getReply(): Promise<AnswerType> {
    if (!this.chatInfo.groupId) {
      console.error("This command is only available in group chats");
      return { text: "This command is only available in group chats" };
    }
    const isUserBanned = await this.database.isUserBanned(this.chatInfo.chatId);
    if (isUserBanned) {
      console.error("You are banned from using this command");
      return { text: "You are banned from using this command" };
    }
    const users = await this.database.getUsersByGroupId(this.chatInfo.groupId);
    if (users === undefined) {
      console.error("No users found");
      return { text: "No users found in this chat" };
    }
    return {
      text: `${
        users.map((user) => `@${user.username}`).join(", ")
      }\nTo unsubscribe use /unsuball`,
    };
  }
}
