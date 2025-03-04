import type { IChat } from "../chat/chat.ts";
import type { AnswerType, ICommand } from "./types.ts";

export abstract class BaseCommand implements ICommand {
  constructor(chatInfo: IChat) {
    this._chatInfo = chatInfo;
  }
  private static commandPrefix: string = "/";
  private _arguments: string[] = [];
  public get arguments(): string[] {
    // ONLY IN CASE arguments are accessed the code parses them
    this.parseArguments(this._chatInfo.userQuery);
    return this._arguments;
  }
  protected abstract name: string;
  protected abstract description: string;
  public getName(): string {
    return this.name;
  }
  public getDescription(): string {
    return this.description;
  }
  private _chatInfo: IChat;
  public get chatInfo(): IChat {
    return this._chatInfo;
  }
  public static isValidCommand(message: string, commandName?: string): boolean {
    const regex = new RegExp(
      `^${BaseCommand.commandPrefix}${
        commandName || "\\w+"
      }\\b(?:@\\w+)?(\\s*)?(.+)*$`,
    );
    return regex.test(message);
  }
  public isValidCommand(message: string): boolean {
    return BaseCommand.isValidCommand(message, this.name);
  }
  public abstract getReply(): Promise<AnswerType> | AnswerType;
  private parseArguments(userQuery: string | null): void {
    if (!userQuery) return;
    const parts = userQuery.trim().split(/\s+/); // Split by spaces
    if (
      parts.length >= 2 && this.isValidCommand(parts[0])
    ) {
      this._arguments = parts.slice(1); // Store all parts after the command name
    }
  }
}
