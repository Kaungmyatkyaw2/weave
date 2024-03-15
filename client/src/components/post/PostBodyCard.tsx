import { Post } from "@/types/post.types";
import ReactTimeAgo from "react-time-ago";
import ImageVideoPlayer from "./ImageVideoPlayer";
import SharedPostPreviewCard from "./SharedPostPreviewCard";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../user/UserAvatar";
import ShowMoreText from "react-show-more-text";
import { Globe2, Lock } from "lucide-react";

const PostBodyCard = ({
  post,
  toShowSharedPost,
}: {
  post: Post;
  toShowSharedPost?: boolean;
}) => {
  const navigate = useNavigate();


  const displayText = (inputText: string) => {
    const formattedText = inputText.replace(/\n/g, "<br>");

    return { __html: formattedText };
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/post/${post._id}`);
      }}
      className="flex space-x-[10px] cursor-pointer"
    >
      <div className="w-50px relative flex flex-col items-center">
        <UserAvatar className=" w-[50px] h-[50px]" user={post.user} />
        <div className="w-[2px] h-full bg-gray-200 dark:bg-gray-500 rounded-b-md"></div>
      </div>

      <div className="py-[1px] w-full">
        <div
          className="flex space-x-[10px] items-center cursor-pointer w-fit"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/user/${post.user._id}`);
          }}
        >
          <h1 className="text-md font-bold">{post.user?.displayName}</h1>
          <p className="text-sm text-smoke">@{post.user?.userName}</p>
          {post.privacy === "PRIVATE" ? (
            <Lock size={15} />
          ) : (
            <Globe2 size={15} />
          )}
        </div>
        <p className="text-[13px] text-smoke pb-[13px]">
          <ReactTimeAgo
            date={new Date(post.createdAt).getTime()}
            locale="en-US"
          />
        </p>
        <ShowMoreText
          className="text-sm text-smoke"
          more={<span className="font-medium cursor-pointer">See more</span>}
          less={<span className="font-medium cursor-pointer">See less</span>}
        >
          <div dangerouslySetInnerHTML={displayText(post.title || "")}></div>
        </ShowMoreText>
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
