export interface IChat {
  chatId: number;
  isGroup: boolean;
  username: string;
  firstName: string;
  secondName: string;
  userQuery: string | null;
  group?: IGroupChat;
}

interface IGroupChat {
  id: number;
  title: string;
}

interface IUser {
  id: string;
  username: string;
  platform: string;
}
