import OpenAI from "npm:openai";

export async function getChatGPTReply(
  { adminPrompt, userPrompt }: { adminPrompt: string; userPrompt: string },
): Promise<string | null> {
  const payloadQuery:
    OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: adminPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    };

  // deno-lint-ignore no-explicit-any
  let response: any = null;
  let openai: OpenAI | null = null;
  try {
    openai = new OpenAI({
      apiKey: Deno.env.get("OPEANAI_API_KEY") as string,
      baseURL: "https://api.aimlapi.com/v1",
    });
    response = await openai.chat.completions.create(payloadQuery);
  } catch (error) {
    console.log("Using the reserved API key", error);
    openai = new OpenAI({
      apiKey: Deno.env.get("RESERVE_OPENAI_API_KEY") as string,
      baseURL: "https://api.aimlapi.com/v1",
    });
    response = await openai.chat.completions.create(payloadQuery);
  }

  return response.choices[0].message.content;
}
