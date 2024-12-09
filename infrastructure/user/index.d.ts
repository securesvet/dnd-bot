import type { Queue } from "../../helpers/index.ts";

interface IUser {
    id: string;
    username: string; 
    commandsQueue: Queue<string>;
    platform: string;
}