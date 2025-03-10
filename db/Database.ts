import "jsr:@std/dotenv/load";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import type { QueryObjectResult } from "https://deno.land/x/postgres@v0.17.0/query/query.ts";

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
    const exists = await this.client.queryObject<{ count: number }>(
      `SELECT COUNT(*) as count 
       FROM group_members 
       WHERE group_id = $1 AND chat_id = $2`,
      [groupId, chatId],
    );

    // Step 2: Insert only if the pair does not exist
    if (exists.rows[0].count === 0) {
      await this.client.queryObject(
        `INSERT INTO group_members (group_id, chat_id) 
         VALUES ($1, $2)`,
        [groupId, chatId],
      );
      console.log(`User ${chatId} added to group ${groupId}`);
    } else {
      console.log(`User ${chatId} is already in group ${groupId}`);
    }
  }

  public async getUsersByGroupId(groupId: number): Promise<UsersSchema[]> {
    const primaryId = await this.getGroupId(groupId);
    return (await this.client.queryObject<UsersSchema>(
      `SELECT u.* 
       FROM users u
       JOIN group_members gm ON gm.group_id = $1`,
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
