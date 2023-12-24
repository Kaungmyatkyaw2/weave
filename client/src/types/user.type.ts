export interface User {
  userName: string;
  displayName: string;
  email: string;
  profilePicture?: string;
  active: boolean;
  createdAt: Date;
  _id: string;
}
