import { User } from "./user.type";

export interface Comment {
  _id: string;
  post: string;
  user: User;
  comment: string;
  isReply?: boolean;
  repliedComment?: string;
  createdAt: Date;
  replies?: Comment[];
}
