import { Post } from "@/types/post.types";
import ReactTimeAgo from "react-time-ago";
import ImageVideoPlayer from "./ImageVideoPlayer";
import SharedPostPreviewCard from "./SharedPostPreviewCard";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../user/UserAvatar";
import ShowMoreText from "react-show-more-text";

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

  const displayText = (inputText: string) => {
    // Replace newline characters with HTML line breaks
    const formattedText = inputText.replace(/\n/g, "<br>");

    // Set the content using dangerouslySetInnerHTML
    return { __html: formattedText };
  };

  return (
    <div className="flex space-x-[10px]">
      <UserAvatar className=" w-[50px] h-[50px]" user={post.user} />

      <div className="py-[1px] w-full">
        <div
          className="flex space-x-[10px] items-center cursor-pointer w-fit"
          onClick={toUserPage}
        >
          <h1 className="text-md font-bold">{post.user?.displayName}</h1>
          <p className="text-sm text-smoke">@{post.user?.userName}</p>
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
