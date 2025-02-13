export abstract class BaseCommand implements ICommand {
  static commandPrefix: string = "/";
  private _arguments: string[] = [];
  private _userQuery: string | null = null;

  get arguments(): string[] {
    return this._arguments;
  }
  set arguments(args: string[]) {
    this._arguments = args;
  }
  abstract name: string;
  abstract description: string;
  get userQuery(): string | null {
    return this._userQuery;
  }
  set userQuery(query: string | null) {
    this._userQuery = query;
    if (query) this.parseArguments(query); // Automatically parse arguments
  }
  abstract getReply(): Promise<AnswerType[]> | AnswerType[];
  isValidTrigger(text: string): boolean {
    return text.toLowerCase().includes(this.name);
  }
  parseArguments(userQuery: string): void {
    const parts = userQuery.trim().split(/\s+/); // Split by spaces
    if (
      parts.length > 1 &&
      parts[0] === `${BaseCommand.commandPrefix}${this.name}`
    ) {
      this._arguments = parts.slice(1); // Store all parts after the command name
    } else {
      this._arguments = [];
    }
  }
}
