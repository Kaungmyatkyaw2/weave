import { PostCard } from ".";
import { Post } from "@/types/post.types";

const PostSharedCard = ({ post }: { post: Post }) => {
  return <PostCard post={post} isPreview />;
};

export default PostSharedCard;
