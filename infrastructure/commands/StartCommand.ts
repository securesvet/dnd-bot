import { BaseCommand } from "./BaseCommand.ts";
import type { AnswerType } from "./types.ts";

export class StartCommand extends BaseCommand {
  protected name: string = "start";
  protected description: string = "Start the bot";
  getReply(): AnswerType {
    return {
      text:
        `Hello, ${this.chatInfo.username}\nThis bot is used to play fun games for a group of people!  🥳\nTry “Alias” or “The Spy” for instance 🕵️‍♀️\nYou can play using one or multiple phones📱`,
    };
  }
}
