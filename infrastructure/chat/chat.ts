export interface IChat {
  chatId: string;
  username: string;
  firstName: string;
  secondName: string;
  userQuery: string | null;
}

interface IGroupChat {
  members: IUser[];
}

interface IUser {
  id: string;
  username: string;
  platform: string;
}
