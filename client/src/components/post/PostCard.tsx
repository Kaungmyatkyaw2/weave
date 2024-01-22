import {
  Copy,
  LucideIcon,
  MessageSquare,
  Pen,
  Share2,
  Trash,
} from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from "react";
import { Post } from "@/types/post.types";
import { CreateUpdatePostDialog, CreateUpdateSharePostDialog } from ".";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import DeletePostDialog from "./DeletePostDialog";
import PostBodyCard from "./PostBodyCard";
import { CommentDialog } from "../comment";
import MoreOptions from "@/shared/others/MoreOptions";

interface ActionBtnProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon: LucideIcon;
  des: string;
}

const ActionBtn = ({ des, onClick, ...props }: ActionBtnProps) => (
  <button
    className="text-sm flex items-center space-x-[10px] text-gray-500"
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(e);
    }}
    {...props}
  >
    <props.icon size={19} />
  </button>
);

export const PostCard = ({
  post,
  isForPage,
}: {
  post: Post;
  isForPage?: boolean;
}) => {
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
            actions={[
              {
                icon: Pen,
                text: "Edit",
                onClick: () => {
                  post.isSharedPost
                    ? setOpenShareEdit(true)
                    : setOpenEdit(true);
                },
              },
              {
                icon: Trash,
                text: "Delete",
                onClick: () => {
                  setOpenDelete(true);
                },
              },
            ]}
          />
        )}
      </div>

      <PostBodyCard post={post} toShowSharedPost />
      <div className="flex items-center space-x-[20px] pl-[55px] pt-[10px]">
        <ActionBtn
          des={"Share"}
          icon={Share2}
          onClick={(e) => {
            setOpenShare(true);
            e.stopPropagation();
          }}
        />
        {isForPage && (
          <ActionBtn
            des={"Comment"}
            icon={MessageSquare}
            onClick={(e) => {
              setOpenComment(true);
              e.stopPropagation();
            }}
          />
        )}
        <ActionBtn
          des={"Copy"}
          icon={Copy}
          onClick={(e) => {
            const host = window.location.host;
            navigator.clipboard.writeText(`${host}/post/${post._id}`);
            e.stopPropagation();
          }}
        />
      </div>
    </div>
  );
};
