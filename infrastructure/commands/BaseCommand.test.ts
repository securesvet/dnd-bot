import { assertEquals } from "https://deno.land/std@0.214.0/assert/mod.ts";
import { BaseCommand } from "./BaseCommand.ts";
import type { AnswerType } from "./types.ts";
import { Database } from "../../db/Database.ts";

// 🔹 Mock subclass for testing
class TestCommand extends BaseCommand {
  name = "test";
  description = "A test command";

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
}

// 🔹 Mock Chat Data
const mockChatInfo = {
  chatId: 3141592653,
  username: "tester",
  firstName: "Test",
  secondName: "User",
  userQuery: "/test arg1 arg2",
  isGroup: false,
};

const database = new Database(
  "postgres://postgres:password@localhost:5432/bot",
);

Deno.test("parseArguments extracts correct arguments", () => {
  const command = new TestCommand({ chatInfo: mockChatInfo, database });
  assertEquals(command.arguments, ["arg1", "arg2"]);
});

Deno.test("isValidTrigger correctly identifies trigger", () => {
  const command = new TestCommand({ chatInfo: mockChatInfo, database });
  assertEquals(command.isValidCommand("/test"), true);
  assertEquals(command.isValidCommand("/test arg1"), true);
  assertEquals(command.isValidCommand("/hello@bot arg1"), false);
  assertEquals(command.isValidCommand("test@bot arg1"), false);
  assertEquals(command.isValidCommand(""), false);
});

Deno.test("getUserInfo returns correct user data", async () => {
  const command = new TestCommand({ chatInfo: mockChatInfo, database });
  const user = await command.getUserInfo("123");
  assertEquals(user.username, "testuser");
  assertEquals(user.firstName, "Test");
  assertEquals(user.lastName, "User");
});
