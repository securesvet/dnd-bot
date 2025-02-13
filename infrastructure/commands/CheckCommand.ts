import { BaseCommand } from "./BaseCommand.ts";
import { getRandomInRange } from "../../helpers/getRandomInRange.ts";

export class CheckCommand extends BaseCommand {
  name: string = "check";
  description: string =
    "Пройди проверку, сможет ли твой герой сделать определенное действие";

  private difficulty = getRandomInRange(1, 20);

  private userDifficulty: number = getRandomInRange(1, 20);
  override getReply(): AnswerType[] {
    if (this.arguments.length === 0) {
      return [{ text: "Please provide a question." }];
    }

    return [{
      text:
        `Окей, ты хочешь пройти проверку и узнать, получится ли у тебя:\n<i>${
          this.arguments.join(" ")
        }</i>\nСложность: <b>${this.difficulty}</b>\nУ тебя выпало: <b>${this.userDifficulty}</b>\nРезультат: ${
          this.difficulty === this.userDifficulty ? "Success" : "Failure"
        }\nОписание: <b>${"Пока не сделал ИИ сюда, друг"}</b>`,
    }];
  }
}
