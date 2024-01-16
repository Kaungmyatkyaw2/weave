import UserAvatar from "../user/UserAvatar";
import ReactTimeAgo from "react-time-ago";
import { Comment } from "@/types/comment.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { useDeleteComment } from "@/hooks/query/comment.hooks";
import useErrorToast from "@/hooks/useErrorToast";
import { useToast } from "../ui/use-toast";

function MoreOptions({ onDelete }: { onDelete: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24">
        {/* <DropdownMenuItem
          onClick={() => {
            setEditOpen(true);
          }}
          className="cursor-pointer space-x-[10px] flex items-center py-[8px]"
        >
          <Pen size={15} />
          <span>Edit</span>
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer space-x-[10px] flex items-center py-[8px]"
        >
          <Trash size={15} />
          <span>Delete</span>
        </DropdownMenuItem>{" "}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const CommentCard = ({ comment }: { comment: Comment }) => {
  const deleteMutation = useDeleteComment();
  const errToast = useErrorToast();
  const { toast } = useToast();

  const onDelete = () => {
    deleteMutation.mutateAsync(comment, {
      onSuccess() {
        toast({
          title: "Succesfully delete the comment 🎉🎉",
        });
      },
      onError(error: any) {
        errToast(error, "Failed to delete commment");
      },
    });
  };

  return (
    <div
      className={`p-[10px] border rounded-[10px] ${
        deleteMutation.isLoading
          ? "bg-gray-50 opacity-80 cursor-not-allowed"
          : ""
      }`}
    >
      <div className="flex space-x-[10px]">
        <UserAvatar user={comment.user} />
        <div className="w-full md:space-y-[5px] space-y-[13px]">
          <div className="flex items-center justify-between pt-[2px] ">
            <div className="flex md:items-center md:flex-row flex-col text-sm md:space-y-0 space-y-[2px] md:space-x-2">
              <h1 className="font-bold">{comment.user.displayName}</h1>
              <div className="flex items-center space-x-2 md:text-sm text-[12px]">
                <p>@{comment.user.userName}</p>
                <ReactTimeAgo date={new Date(comment.createdAt)} />
              </div>
            </div>
            <MoreOptions onDelete={onDelete} />
          </div>
          <p className="text-sm">{comment.comment}</p>
        </div>
      </div>
    </div>
  );
};
