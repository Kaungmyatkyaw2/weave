import { User } from "./user.type";

interface ExtPost {
  createdAt: Date;
  image?: string;
  privacy: "PRIVATE" | "PUBLIC";
  title?: string;
  user: User;
  _id: string;
}

export interface Post extends ExtPost {
  isSharedPost: boolean;
  sharedPost: ExtPost;
}
