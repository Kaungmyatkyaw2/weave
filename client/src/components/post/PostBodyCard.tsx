import { Post } from "@/types/post.types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import ReactTimeAgo from "react-time-ago";
import ImageVideoPlayer from "./ImageVideoPlayer";
import SharedPostPreviewCard from "./SharedPostPreviewCard";
import { useNavigate } from "react-router-dom";

const PostBodyCard = ({
  post,
  toShowSharedPost,
}: {
  post: Post;
  toShowSharedPost?: boolean;
}) => {
  const navigate = useNavigate();

  const toUserPage = () => {
    navigate(`/user/${post.user._id}`);
  };

  return (
    <div className="flex space-x-[10px]">
      <Avatar className=" w-[50px] h-[50px] cursor-pointer" onClick={toUserPage}>
        <AvatarFallback className="bg-green-500">
          {post.user?.displayName.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="py-[1px] w-full">
        <div className="flex space-x-[10px] items-center cursor-pointer w-fit" onClick={toUserPage}>
          <h1 className="text-md font-bold">{post.user?.displayName}</h1>
          <p className="text-sm text-smoke">@{post.user?.userName}</p>
        </div>
        <p className="text-[13px] text-smoke pb-[13px]">
          <ReactTimeAgo
            date={new Date(post.createdAt).getTime()}
            locale="en-US"
          />
        </p>
        <p className="text-smoke text-sm">{post.title}</p>
        <ImageVideoPlayer src={post.image} />
        {post.isSharedPost && toShowSharedPost && (
          <div className="min-w-full pt-[10px]">
            <SharedPostPreviewCard post={post.sharedPost} />{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostBodyCard;
