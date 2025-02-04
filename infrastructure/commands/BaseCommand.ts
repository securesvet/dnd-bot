export abstract class BaseCommand implements ICommand {
  static commandPrefix: string = "/";
  protected abstract name: string;
  protected abstract description: string;

  getName(): string {
    return this.name;
  }
  getDescription(): string {
    return this.description;
  }
  isValidTrigger(text: string): boolean {
    return text.toLowerCase().includes(this.name);
  }
  abstract getReply(userQuery?: string): AnswerType[];
}
