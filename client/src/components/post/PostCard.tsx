import { MoreHorizontal, Pen, Share2, Trash } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from "react";
import { Post } from "@/types/post.types";
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
import DeletePostDialog from "./DeletePostDialog";
import PostBodyCard from "./PostBodyCard";

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

export const PostCard = ({ post }: { post: Post }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openShareEdit, setOpenShareEdit] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  return (
    <div
      className={"w-full border rounded-md space-y-[20px] px-[20px] py-[20px] "}
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

      <div className="flex justify-between items-center">
        <ShareBtn onClick={() => setOpenShare(true)} />
        {post.user._id == currentUser?._id && (
          <MoreOptions
            setEditOpen={post.isSharedPost ? setOpenShareEdit : setOpenEdit}
            setDeleteOpen={setOpenDelete}
          />
        )}
      </div>

      <PostBodyCard post={post} toShowSharedPost />
    </div>
  );
};
