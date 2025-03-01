import "jsr:@std/dotenv/load";
import { BaseCommand } from "./BaseCommand.ts";
import { getRandomInRange } from "../../helpers/getRandomInRange.ts";
import { getChatGPTReply } from "../../helpers/getChatGPTReply.ts";

export class CheckCommand extends BaseCommand {
  name: string = "check";
  description: string =
    "Пройди проверку, сможет ли твой герой сделать определенное действие";

  private userDifficulty: number = this.getRandomD20();
  private difficulty: number = this.getRandomD20();
  override async getReply(): Promise<AnswerType> {
    this.difficulty = this.getRandomD20();
    this.userDifficulty = this.getRandomD20();
    if (this.arguments.length === 0) {
      return { text: "Please provide a question." };
    }
    const adminPrompt =
      `Ты мастер игры ДНД, тебя спрашивают, сможет ли герой пройти проверку. Красочно опиши. Никаких дополнительных комментариев не требуется. Сложность: ${this.difficulty}, игроку выпало: ${this.userDifficulty}.`;
    const isSuccess = this.difficulty <= this.userDifficulty;
    const admingPromptSuccessOrFailureText = isSuccess
      ? "Герой проходит проверку"
      : "Герой не проходит проверку";
    let gptReply: string | null;
    try {
      gptReply = await getChatGPTReply({
        adminPrompt: adminPrompt + admingPromptSuccessOrFailureText,
        userPrompt: this.arguments.join(" "),
      });
    } catch (error) {
      console.error(error);
      gptReply =
        "Слушай, я не знаю, У меня закончились мозги, надо подождать немного";
    }
    return {
      text:
        `Окей, ты хочешь пройти проверку и узнать, получится ли у тебя:\n<i>${
          this.arguments.join(" ")
        }</i>\nСложность: <b>${this.difficulty}</b>\nУ тебя выпало: <b>${this.userDifficulty}</b>\nРезультат: ${
          this.difficulty <= this.userDifficulty ? "Success" : "Failure"
        }\nОписание: <b>${gptReply}</b>`,
    };
  }

  private getRandomD20(): number {
    return getRandomInRange(1, 20);
  }
}
