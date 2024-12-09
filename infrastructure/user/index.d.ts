import type { Queue } from "@dndbot/helpers";

interface IUser {
  id: string;
  username: string;
  commandsQueue: Queue<string>;
  platform: string;
}
