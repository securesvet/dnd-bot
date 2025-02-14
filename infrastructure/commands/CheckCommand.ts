import "jsr:@std/dotenv/load";
import { BaseCommand } from "./BaseCommand.ts";
import { getRandomInRange } from "../../helpers/getRandomInRange.ts";
import { getChatGPTReply } from "../../helpers/getChatGPTReply.ts";
import axios from "npm:axios";

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
    const adminPrompt =
      `Ты мастер игры ДНД, тебя спрашивают, сможет ли герой пройти проверку. Красочно опиши. Никаких дополнительных комментариев не требуется.`;
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
    return [{
      text:
        `Окей, ты хочешь пройти проверку и узнать, получится ли у тебя:\n<i>${
          this.arguments.join(" ")
        }</i>\nСложность: <b>${this.difficulty}</b>\nУ тебя выпало: <b>${this.userDifficulty}</b>\nРезультат: ${
          this.difficulty <= this.userDifficulty ? "Success" : "Failure"
        }\nОписание: <b>${gptReply}</b>`,
    }];
  }
  private async getGPTReply(): Promise<string> {
    const adminPrompt =
      `Ты мастер игры ДНД, тебя спрашивают, сможет ли герой пройти проверку, сложность проверки: ${this.difficulty}, что выпало у игрока: ${this.userDifficulty}. Красочно опиши процесс того, как получилось у игрока или не получилось совершить действие. Никаких дополнительных комментариев не требуется.`;
    const url =
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";
    const data = {
      modelUri: `gpt://${Deno.env.get("FOLDER_ID") as string}/yandexgpt`,
      completionOptions: {
        stream: false,
        temperature: 0.6,
        maxTokens: "2000",
        reasoningOptions: {
          mode: "DISABLED",
        },
      },
      messages: [
        {
          role: "system",
          text: adminPrompt,
        },
        {
          role: "user",
          text: this.arguments.join(" "),
        },
      ],
    };

    // Настройки запроса
    const config = {
      method: "post",
      url: url, // Замените на URL вашего API
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("IAM_TOKEN") as string}`,
      },
      data: data,
    };

    try {
      const response = await axios(config);
      console.log(response.data.result.alternatives[0].message.text);
      return response.data.result.alternatives[0].message.text;
    } catch (error) {
      console.error("Ошибка при вызове API:", error);
      return "Произошла ошибка при вызове API.";
    }
  }
}
