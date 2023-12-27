import { Share2 } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Post } from "@/types/post.types";
import ReactTimeAgo from "react-time-ago";

const ShareBtn = ({
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => (
  <button className="text-sm flex items-center space-x-[10px]" {...props}>
    <Share2 size={20} /> <span>Share</span>
  </button>
);

const ImageVideoPlayer = ({ src }: { src?: string | undefined }) => {
  if (!src) {
    return <></>;
  }

  return (
    <div className=" pt-[10px] max-w-full">z
      {src?.includes("video") ? (
        <video src={src} height={400} width={400} controls />
      ) : (
        <img
          className="max-w-[100%] h-[300px] min-h-[200px] object-cover rounded-[10px]"
          src={src}
        />
      )}
    </div>
  );
};

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <div className="w-full border px-[20px] py-[20px] rounded-md space-y-[20px]">
      <ShareBtn />
      <div className="flex space-x-[10px]">
        <Avatar className=" w-[50px] h-[50px]">
          <AvatarFallback className="bg-green-500">
            {post.user.displayName.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="py-[1px]">
          <div className="flex space-x-[10px] items-center">
            <h1 className="text-md font-bold">{post.user.displayName}</h1>
            <p className="text-sm text-smoke">@{post.user.userName}</p>
          </div>
          <p className="text-[13px] text-smoke pb-[10px]">
            <ReactTimeAgo date={post.createdAt} locale="en-US" />
          </p>
          <p className="pt-[5px] text-smoke text-sm">{post.title}</p>
          <ImageVideoPlayer src={post.image} />
        </div>
      </div>
    </div>
  );
};
