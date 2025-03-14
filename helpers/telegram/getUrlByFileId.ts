type TelegramGetFileResponseType = {
  ok: boolean;
  result: {
    file_id: string;
    file_unique_id: string;
    file_size: number;
    file_path: string;
  };
};

export async function getUrlByFileId(fileId: string): Promise<string> {
  const API = Deno.env.get("TELEGRAM_API_KEY");
  const response = await fetch(
    `https://api.telegram.org/bot${API}/getFile?file_id=${fileId}`,
    {
      method: "GET",
    },
  );
  const { file_path }: TelegramGetFileResponseType["result"] = await response
    .json();

  return `https://api.telegram.org/file/bot${API}/${file_path}`;
}
