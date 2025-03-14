import "jsr:@std/dotenv/load";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import type { QueryObjectResult } from "https://deno.land/x/postgres@v0.17.0/query/query.ts";
import type { IChat } from "../infrastructure/chat/chat.ts";

export type UsersSchema = {
  chat_id: number;
  username: string;
  first_name: string;
  second_name: string;
};

export type GroupsSchema = {
  group_id: number;
  group_name: string;
};

export type GroupMembersSchema = {
  group_id: number;
  chat_id: number;
};

export class Database {
  private DATABASE_URL: string;
  constructor(DATABASE_URL: string) {
    this.DATABASE_URL = DATABASE_URL;
    this.client = new Client(this.DATABASE_URL);
  }
  private client: Client;
  private _isConnected: boolean = false;
  public get isConnected(): boolean {
    return this._isConnected;
  }

  public async onEveryMessage(chatInfo: IChat) {
    if (chatInfo.group) {
      const isGroupNew = await this.isGroupNew(chatInfo.group.id);
      if (isGroupNew) {
        this.insertNewGroup({
          group_id: chatInfo.group.id,
          group_name: chatInfo.group.title,
        });
      }
    }

    const isUserNew = await this.isUserNew(chatInfo.chatId);
    if (isUserNew) {
      this.insertUser({
        chat_id: chatInfo.chatId,
        username: chatInfo.username,
        first_name: chatInfo.firstName || "",
        second_name: chatInfo.secondName || "",
      });
    }

    if (chatInfo.group) {
      this.insertNewGroupMembers({
        group_id: chatInfo.group.id,
        chat_id: chatInfo.chatId,
      });
    }
  }
  async insertUser(userInfo: UsersSchema): Promise<void> {
    await this.client.queryObject(
      "INSERT INTO users (chat_id, username, first_name, second_name) VALUES ($1, $2, $3, $4)",
      [
        userInfo.chat_id,
        userInfo.username,
        userInfo.first_name,
        userInfo.second_name,
      ],
    );
    console.log("New user registered");
  }
  getUserInfoByChatID(
    chatId: UsersSchema["chat_id"],
  ): Promise<QueryObjectResult<UsersSchema>> {
    return this.client
      .queryObject(`SELECT * FROM users WHERE chat_id = $1`, [chatId]);
  }
  public async isUserNew(chatId: UsersSchema["chat_id"]): Promise<boolean> {
    const data = await this.getUserInfoByChatID(chatId);
    return data.rows.length === 0;
  }
  public async connect() {
    try {
      await this.client.connect();
      this._isConnected = true;
      console.log("Connected to PostgreSQL");
    } catch (error) {
      console.error("Failed to connect to PostgreSQL", error);
    }
  }
  public async disconnect() {
    try {
      await this.client.end();
      this._isConnected = false;
      console.log("Disconnected from PostgreSQL");
    } catch (error) {
      console.error("Failed to disconnect from PostgreSQL", error);
    }
  }
  public async getUsers(): Promise<UsersSchema[]> {
    const data = await this.client.queryObject<
      UsersSchema
    >("SELECT * FROM users");
    return data.rows;
  }
  public async init() {
    await this.initUsers();
    await this.initGroups();
    await this.initBannedUsers();
  }
  private async initUsers() {
    try {
      await this.client.queryObject(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          chat_id bigint UNIQUE NOT NULL,
          username VARCHAR(255),
          first_name VARCHAR(255),
          second_name VARCHAR(255)
        )
      `);
    } catch (error) {
      console.error("Error initializing users table:", error);
    }
  }
  private async initGroups() {
    try {
      await this.client.queryObject(`
    CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        group_id bigint UNIQUE NOT NULL,
        group_name VARCHAR(255) NOT NULL
      );

    CREATE TABLE IF NOT EXISTS group_members (
        id SERIAL PRIMARY KEY,
        group_id bigint REFERENCES groups(id) ON DELETE CASCADE,
        chat_id bigint REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(group_id, chat_id)
      );
      `);
    } catch (error) {
      console.error("Error initializing groups table:", error);
    }
  }
  private async initBannedUsers() {
    try {
      await this.client.queryObject(`
    CREATE TABLE IF NOT EXISTS banned_members (
        id SERIAL PRIMARY KEY,
        chat_id bigint REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(chat_id)
      );
      `);
    } catch (error) {
      console.error("Error initializing banned members table:", error);
    }
  }
  public async getBannedUsers(): Promise<UsersSchema[]> {
    const data = await this.client.queryObject<UsersSchema>(
      `SELECT u.* from users u JOIN banned_members bm ON u.id = bm.chat_id`,
    );
    return data.rows;
  }
  public async isUserBanned(chatId: UsersSchema["chat_id"]): Promise<boolean> {
    const data = await this.client
      .queryObject<UsersSchema>(
        `SELECT u.* FROM users u JOIN banned_members bm ON u.id = bm.chat_id WHERE u.chat_id = $1`,
        [
          chatId,
        ],
      );
    return data.rows.length > 0;
  }
  public async isGroupNew(
    groupId: GroupsSchema["group_id"],
  ): Promise<boolean> {
    const data = await this.client
      .queryObject<GroupsSchema>(`SELECT * FROM groups WHERE group_id = $1`, [
        groupId,
      ]);
    return data.rows.length === 0;
  }
  public insertNewGroup({ group_id, group_name }: GroupsSchema) {
    this.client.queryObject(
      `INSERT INTO groups (group_id, group_name) VALUES ($1, $2)`,
      [group_id, group_name],
    );
  }
  public async insertNewGroupMembers(
    { group_id, chat_id }: GroupMembersSchema,
  ) {
    const groupId = await this.getGroupId(group_id);
    const chatId = await this.getChatId(chat_id);

    if (!groupId) throw new Error(`Group with group_id ${group_id} not found.`);
    if (!chatId) throw new Error(`User with chat_id ${chat_id} not found.`);

    await this.addUserToGroup(groupId, chatId);
    console.log(`User ${chat_id} added to Group ${group_id}`);
  }

  private async getGroupId(group_id: number): Promise<number | null> {
    const result = await this.client.queryObject<{ id: number }>(
      `SELECT id FROM groups WHERE group_id = $1`,
      [group_id],
    );
    return result.rows.length > 0 ? result.rows[0].id : null;
  }

  private async getChatId(chat_id: number): Promise<number | null> {
    const result = await this.client.queryObject<{ id: number }>(
      `SELECT id FROM users WHERE chat_id = $1`,
      [chat_id],
    );
    return result.rows.length > 0 ? result.rows[0].id : null;
  }

  private async addUserToGroup(groupId: number, chatId: number) {
    const result = await this.client.queryObject(
      `INSERT INTO group_members (group_id, chat_id) 
       VALUES ($1, $2) 
       ON CONFLICT (group_id, chat_id) DO NOTHING 
       RETURNING *`, // Returns the inserted row if successful
      [groupId, chatId],
    );

    if (result.rows.length > 0) {
      console.log(`User ${chatId} added to group ${groupId}`);
    } else {
      console.log(`User ${chatId} is already in group ${groupId}`);
    }
  }

  public async getUsersByGroupId(groupId: number): Promise<UsersSchema[]> {
    const primaryId = await this.getGroupId(groupId);
    return (await this.client.queryObject<UsersSchema>(
      `SELECT u.* from users u JOIN group_members gm ON u.id = gm.chat_id WHERE gm.group_id = $1`,
      [primaryId],
    )).rows;
  }
  public async inserMemberToGroupMembers(
    { group_id, chat_id }: {
      group_id: GroupsSchema["group_id"];
      chat_id: UsersSchema["chat_id"];
    },
  ) {
    await this.client.queryObject(
      `INSERT INTO group_members (group_id, chat_id) VALUES ($1, $2)`,
      [group_id, chat_id],
    );
  }
}
