import OpenAI from "npm:openai";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPEANAI_API_KEY") as string,
  baseURL: "https://api.aimlapi.com/v1",
});

export async function getChatGPTReply(
  { adminPrompt, userPrompt }: { adminPrompt: string; userPrompt: string },
): Promise<string | null> {
  const response = await openai.chat.completions.create({
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
  });
  return response.choices[0].message.content;
}
