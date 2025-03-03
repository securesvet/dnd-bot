import {
  assertArrayIncludes,
  assertEquals,
} from "https://deno.land/std@0.214.0/assert/mod.ts";
import { BaseCommand } from "./BaseCommand.ts"; // Adjust path as needed
import type { AnswerType } from "./types.ts";
import type { IChat } from "../chat/chat.ts";

// 🔹 Mock subclass for testing
class TestCommand extends BaseCommand {
  name = "test";
  description = "A test command";

  constructor(chatInfo: IChat) {
    super(chatInfo);
    console.log(this.name);
    console.log(this.chatInfo);
    console.log(this.arguments);
  }
  getReply(): AnswerType {
    return { text: "Test reply" };
  }

  getUserInfo(_userId: string) {
    return {
      id: "123",
      username: "testuser",
      firstName: "Test",
      lastName: "User",
    };
  }

  getChatMembers(_chatId: string) {
    return [
      { id: "123", username: "testuser1", firstName: "User", lastName: "One" },
      { id: "456", username: "testuser2", firstName: "User", lastName: "Two" },
    ];
  }
}

// 🔹 Mock Chat Data
const mockChatInfo = {
  chatId: "chat123",
  username: "tester",
  firstName: "Test",
  secondName: "User",
  userQuery: "/test arg1 arg2",
};

Deno.test("parseArguments extracts correct arguments", () => {
  const command = new TestCommand(mockChatInfo);
  assertEquals(command.arguments, ["arg1", "arg2"]);
});

Deno.test("isValidTrigger correctly identifies trigger", () => {
  assertEquals(BaseCommand.isValidCommand("/test"), true);
  assertEquals(BaseCommand.isValidCommand("/test arg1"), true);
  assertEquals(BaseCommand.isValidCommand("/hello@bot arg1"), true);
  assertEquals(BaseCommand.isValidCommand("test@bot arg1"), false);
  assertEquals(BaseCommand.isValidCommand(""), false);
});

Deno.test("getUserInfo returns correct user data", async () => {
  const command = new TestCommand(mockChatInfo);
  const user = await command.getUserInfo("123");
  assertEquals(user.username, "testuser");
  assertEquals(user.firstName, "Test");
  assertEquals(user.lastName, "User");
});

Deno.test("getChatMembers returns correct chat members", async () => {
  const command = new TestCommand(mockChatInfo);
  const members = await command.getChatMembers("chat123");

  assertEquals(members.length, 2);
  assertArrayIncludes(members.map((m) => m.username), [
    "testuser1",
    "testuser2",
  ]);
});
