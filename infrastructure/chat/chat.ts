export interface IChat {
  chatId: string;
  name: string;
}

interface IGroupChat {
  members: IUser[];
}

interface IUser {
  id: string;
  username: string;
  platform: string;
}
