import axios from "npm:axios";

export async function getYandexGPTReply(
  { adminPrompt, userPrompt }: { adminPrompt: string; userPrompt: string },
): Promise<string> {
  const url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";
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
        text: userPrompt,
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
