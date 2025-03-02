import type { IChat } from "../chat/chat.ts";

export abstract class BaseCommand implements ICommand {
  constructor(chatInfo: IChat) {
    this.chatInfo = chatInfo;
    this._arguments = this.parseArguments(this.chatInfo.userQuery);
  }
  // ✅ Abstract getter instead of an abstract property
  abstract get name(): string;
  abstract get description(): string;
  protected chatInfo: IChat;
  static commandPrefix: string = "/";
  private _arguments: string[] = [];
  get arguments(): string[] {
    return this._arguments;
  }
  abstract getReply(): Promise<AnswerType> | AnswerType;
  isValidTrigger(text: string): boolean {
    return text.toLowerCase().startsWith(this.name);
  }
  parseArguments(userQuery: string | null): string[] {
    if (!userQuery) return [];
    const parts = userQuery.trim().split(/\s+/); // Split by spaces
    if (
      parts.length >= 2 &&
      parts[0] === `${BaseCommand.commandPrefix}${this.name}`
    ) {
      return parts.slice(1); // Store all parts after the command name
    }
    return [];
  }
}
