import { listOfCommands } from "@dndbot/infrastructure";
import type { Queue } from '@dndbot/helpers';
import type { IUser } from "./index.d.ts";

export class User {
  private _id: string;
  private _username: string;
  public _commandsQueue: Queue<string>;
  private _platform: string;

  constructor({id, username, commandsQueue, platform}: IUser) {
    this._id = id;
    this._username = username;
    this._commandsQueue = commandsQueue;
    this._platform = platform;
  }

  public get id() {
    return this._id;
  }

  public get username() {
    return this._username;
  }

  public get platform() {
    return this._platform;
  }

  public get commandsQueue(): Queue<string> {
    return this._commandsQueue;
  }

  public enqueueCommand(command: string) {
    const isValidCommand = listOfCommands.some(
      (existingCommand) => command === existingCommand.getName()
    );

    if (!isValidCommand) {
        throw new Error(`Such command ${command} does not exist`)
    }

    this._commandsQueue.enqueue(command);
  }
}