import { MoreHorizontal, Pen, Share2, Trash } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Post } from "@/types/post.types";
import ReactTimeAgo from "react-time-ago";
import { Skeleton } from "../ui/skeleton";
import { CreateUpdatePostDialog, CreateUpdateSharePostDialog } from ".";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PostSharedCard from "./PostSharedCard";
import DeletePostDialog from "./DeletePostDialog";

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

function MoreOptions({
  setEditOpen,
  setDeleteOpen,
}: {
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24">
        <DropdownMenuItem
          onClick={() => {
            setEditOpen(true);
          }}
          className="cursor-pointer space-x-[10px] flex items-center py-[8px]"
        >
          <Pen size={15} />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setDeleteOpen(true);
          }}
          className="cursor-pointer space-x-[10px] flex items-center py-[8px]"
        >
          <Trash size={15} />
          <span>Delete</span>
        </DropdownMenuItem>{" "}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const ImageVideoPlayer = ({ src }: { src?: string | undefined }) => {
  if (!src) {
    return <></>;
  }

  return (
    <div className=" pt-[10px] max-w-full">
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

export const SkeletonPostCard = () => {
  return (
    <div className="w-full border px-[20px] py-[20px] rounded-md space-y-[20px]">
      <div className="w-full flex space-x-[10px]">
        <div className="w-[60px]">
          <Skeleton className="h-[50px] w-[50px] rounded-full" />
        </div>

        <div className="py-[1px] w-[calc(100%-60px)]">
          <div className="flex space-x-[10px] items-center">
            <Skeleton className="h-4 w-[50%] " />
            <Skeleton className="h-4 w-[20%] " />
          </div>
          <div className="text-[13px] text-smoke pb-[10px] pt-[5px]">
            <Skeleton className="h-2 w-12 " />
          </div>
          <Skeleton className="h-[100px] w-[70%] " />
        </div>
      </div>
    </div>
  );
};

export const PostCard = ({
  post,
  isPreview,
}: {
  post: Post;
  isPreview?: boolean;
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openShareEdit, setOpenShareEdit] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  return (
    <div
      className={`"w-full border rounded-md space-y-[20px] ${
        isPreview ? "px-[10px] py-[10px] bg-gray-50" : "px-[20px] py-[20px]"
      }`}
    >
      <CreateUpdateSharePostDialog
        toShare={post.sharedPost || post}
        onOpenChange={setOpenShare}
        open={openShare}
      />

      <CreateUpdateSharePostDialog
        isUpdateDialog={true}
        toShare={post.sharedPost || post}
        toUpdateSharedPost={post}
        onOpenChange={setOpenShareEdit}
        open={openShareEdit}
      />

      <CreateUpdatePostDialog
        isUpdateDialog={true}
        orgPost={post}
        onOpenChange={setOpenEdit}
        open={openEdit}
      />

      <DeletePostDialog
        post={post}
        onOpenChange={setOpenDelete}
        open={openDelete}
      />

      {!isPreview && (
        <div className="flex justify-between items-center">
          <ShareBtn onClick={() => setOpenShare(true)} />
          {post.user._id == currentUser?._id && (
            <MoreOptions
              setEditOpen={post.isSharedPost ? setOpenShareEdit : setOpenEdit}
              setDeleteOpen={setOpenDelete}
            />
          )}
        </div>
      )}
      <div className="flex space-x-[10px]">
        <Avatar className=" w-[50px] h-[50px]">
          <AvatarFallback className="bg-green-500">
            {post.user?.displayName.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="py-[1px] w-full">
          <div className="flex space-x-[10px] items-center">
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
          {post.sharedPost && (
            <div className="min-w-full pt-[10px]">
              <PostSharedCard post={post.sharedPost} />{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
