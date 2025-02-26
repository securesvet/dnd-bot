import { BaseCommand } from "./BaseCommand.ts";

export class CreateMemeCommand extends BaseCommand {
  name: string = "creatememe";
  description: string =
    "Create a meme with the provided text. Use | to separate the top and bottom text";

  private async getAvailableTemplates(): Promise<string[]> {
    const response = await fetch("https://api.memegen.link/templates");
    const json = await response.json();
    //TODO: ADD MULTIPLE LINES
    return json.filter((template: { lines: number }) => template.lines === 2)
      .map((template: { id: string }) => template.id);
  }

  private async generateImage(): Promise<string> {
    const argsSplit = this.arguments.join(" ").split("|");
    const topText = argsSplit[0] || "";
    const bottomText = argsSplit[1] || "";
    const templates = await this.getAvailableTemplates();
    const random = templates[Math.floor(Math.random() * templates.length)];
    return `https://api.memegen.link/images/${random}/${topText}/${bottomText}.png?font=impact`;
  }

  async getReply(): Promise<AnswerType> {
    if (this.arguments.length === 0) {
      return {
        text: "Please provide text for the meme.",
      };
    }
    return {
      image: await this.generateImage(),
    };
  }
}
