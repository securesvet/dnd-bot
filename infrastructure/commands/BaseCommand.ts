import type { IChat } from "../chat/chat.ts";
import type { AnswerType, ICommand } from "./types.ts";

export abstract class BaseCommand implements ICommand {
  constructor(chatInfo: IChat) {
    this.chatInfo = chatInfo;
    this.parseArguments(this.chatInfo.userQuery);
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
  static isValidCommand(message: string): boolean {
    const regex = new RegExp(`^/\\w+\\b(?:@\\w+)?\\s*`);
    return regex.test(message);
  }
  abstract getReply(): Promise<AnswerType> | AnswerType;
  parseArguments(userQuery: string | null): void {
    if (!userQuery) return;
    const parts = userQuery.trim().split(/\s+/); // Split by spaces
    console.log(parts[0], `${BaseCommand.commandPrefix}${this.name}`);
    if (
      parts.length >= 2 && BaseCommand.isValidCommand(parts[0])
    ) {
      this._arguments = parts.slice(1); // Store all parts after the command name
    }
  }
}
