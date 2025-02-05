import { BaseCommand } from "./BaseCommand.ts";

export class StartCommand extends BaseCommand {
  protected override name: string = "start";
  protected override description: string = "Start the bot";
  override getReply(_userQuery?: string): AnswerType[] {
    return [{
      text:
        "This bot is used to play fun games for a group of people!  🥳\nTry “Alias” or “The Spy” for instance 🕵️‍♀️\nYou can play using one or multiple phones📱",
    }];
  }
}
