import { BaseCommand } from "./BaseCommand.ts";
import type { AnswerType } from "./types.ts";

export class MentionAllCommand extends BaseCommand {
  protected name = "all";
  protected description = "Command works in group chats, mention all users";
  async getReply(): Promise<AnswerType> {
    console.log(this.chatInfo);
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
    return { text: `${users.map((user) => `@${user.username}`).join(", ")}` };
  }
}
