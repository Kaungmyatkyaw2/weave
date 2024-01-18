import {
  LucideIcon,
  MessageSquare,
  MoreHorizontal,
  Pen,
  Share2,
  Trash,
} from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from "react";
import { Post } from "@/types/post.types";
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
import { CommentDialog } from "../comment";

interface ActionBtnProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon: LucideIcon;
  des: string;
}

const ActionBtn = ({ des, ...props }: ActionBtnProps) => (
  <button
    className="text-sm flex items-center space-x-[10px] text-gray-500"
    {...props}
  >
    <props.icon size={19} />
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

export const PostCard = ({ post }: { post: Post }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openShareEdit, setOpenShareEdit] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  return (
    <div
      className={
        "w-full border rounded-md space-y-[20px] px-[20px] py-[20px] bg-white"
      }
    >
      <CreateUpdateSharePostDialog
        toShare={post.sharedPost || post}
        onOpenChange={setOpenShare}
        open={openShare}
      />

      <CommentDialog
        post={post}
        open={openComment}
        onOpenChange={setOpenComment}
      />

      <CreateUpdateSharePostDialog
        isUpdateDialog={true}
        toShare={post.sharedPost || post}
        orgPost={post}
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

      <div className="flex justify-end items-center">
        {post.user._id == currentUser?._id && (
          <MoreOptions
            setEditOpen={post.isSharedPost ? setOpenShareEdit : setOpenEdit}
            setDeleteOpen={setOpenDelete}
          />
        )}
      </div>

      <PostBodyCard post={post} toShowSharedPost />
      <div className="flex items-center space-x-[20px] pl-[55px] pt-[10px]">
        <ActionBtn
          des={"Share"}
          icon={Share2}
          onClick={() => setOpenShare(true)}
        />
        <ActionBtn
          des={"Comment"}
          icon={MessageSquare}
          onClick={() => setOpenComment(true)}
        />
      </div>
    </div>
  );
};
