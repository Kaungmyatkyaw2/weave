import { User } from "./user.type";

export interface Post {
  createdAt: Date;
  image?: string;
  privacy: "PRIVATE" | "PUBLIC";
  title?: string;
  user: User;
  _id: string;
  isSharedPost?: boolean;
  sharedPost?: Post;
}
