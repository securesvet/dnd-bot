import { BaseCommand } from "./BaseCommand.ts";
import { getRandomInRange } from "../../helpers/getRandomInRange.ts";
import OpenAI from "npm:openai";

export class CheckCommand extends BaseCommand {
  name: string = "check";
  description: string =
    "Пройди проверку, сможет ли твой герой сделать определенное действие";

  private difficulty = getRandomInRange(1, 20);

  private userDifficulty: number = getRandomInRange(1, 20);
  override async getReply(): Promise<AnswerType[]> {
    if (this.arguments.length === 0) {
      return [{ text: "Please provide a question." }];
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get("DISCORD_CHATGPT_KEY") as string,
      baseURL: "https://api.pawan.krd/cosmosrp/v1/chat/completions",
    });
    if (!openai) {
      throw new Error("DISCORD_CHATGPT_KEY environment variable is not set.");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Итак, ты мастер игры в ДНД, тебе задают вопрос по канонам ДНД и ты должен ответить, может ли игрок со сложностью " +
            this.difficulty +
            " сделать следующее ДЕЙСТВИЕ, которое будет идти после двоеточия, не упоминай, что ты чат-бот, игроку выпало на кубике 1к20" +
            this.userDifficulty,
        },
        {
          role: "user",
          content: this.arguments.join(" "),
        },
      ],
    });
    return [{
      text:
        `Окей, ты хочешь пройти проверку и узнать, получится ли у тебя:\n<i>${
          this.arguments.join(" ")
        }</i>\nСложность: <b>${this.difficulty}</b>\nУ тебя выпало: <b>${this.userDifficulty}</b>\nРезультат: ${
          this.difficulty === this.userDifficulty ? "Success" : "Failure"
        }\nОписание: <b>${response.choices[0].message.content}</b>`,
    }];
  }
}
