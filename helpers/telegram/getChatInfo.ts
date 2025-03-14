import type { IChat } from "../../infrastructure/chat/chat.ts";

// deno-lint-ignore no-explicit-any
export function getChatInfo(ctx: any): IChat | undefined {
  if (!ctx || !ctx.from || !ctx.message || !ctx.chat) return;

  const isGroup = ["group", "supergroup", "channel"].includes(ctx.chat.type);
  return {
    chatId: ctx.from.id,
    username: ctx.from.username || "",
    firstName: ctx.from.first_name || "",
    secondName: ctx.from.last_name || "",
    userQuery: ctx.message.text,
    isGroup: isGroup,
    group: isGroup
      ? {
        id: ctx.chat.id,
        title: ctx.chat.title,
      }
      : undefined,
  };
}
