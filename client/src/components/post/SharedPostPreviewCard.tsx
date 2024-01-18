import { Post } from "@/types/post.types";
import { Lock } from "lucide-react";
import PostBodyCard from "./PostBodyCard";

const SharedPostPreviewCard = ({
  post,
}: {
  post: Post | null | string | undefined;
}) => {
  if (
    typeof post == "string" ||
    !post ||
    (post.sharedPost?.privacy == "PRIVATE" &&
      post.user._id != post.sharedPost.user._id)
  ) {
    return (
      <div className="w-full flex  items-center space-x-[10px] border rounded-md bg-gray-50 px-[10px] py-[10px]">
        <Lock size={20} />
        <h1 className="text-sm">Post is no longer available</h1>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-md space-y-[20px]  bg-gray-50 px-[10px] py-[10px]">
      <PostBodyCard post={post} toShowSharedPost={true} />
    </div>
  );
};

export default SharedPostPreviewCard;
