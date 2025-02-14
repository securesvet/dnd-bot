import { listOfCommands } from "../commands/listOfCommands.ts";
import type { Queue } from "../../helpers/index.ts";

interface IUser {
  id: string;
  username: string;
  commandsQueue: Queue<string>;
  platform: string;
}

export class User {
  private _id: string;
  private _username: string;
  public _commandsQueue: Queue<string>;
  private _platform: string;

  constructor({ id, username, commandsQueue, platform }: IUser) {
    this._id = id;
    this._username = username;
    this._commandsQueue = commandsQueue;
    this._platform = platform;
  }

  public get id(): string {
    return this._id;
  }

  public get username(): string {
    return this._username;
  }

  public get platform(): string {
    return this._platform;
  }

  public get commandsQueue(): Queue<string> {
    return this._commandsQueue;
  }

  public enqueueCommand(command: string) {
    const isValidCommand = listOfCommands.some(
      (existingCommand) => command === existingCommand.name,
    );

    if (!isValidCommand) {
      throw new Error(`Such command ${command} does not exist`);
    }

    this._commandsQueue.enqueue(command);
  }
}
