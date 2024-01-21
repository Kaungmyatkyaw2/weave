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
import ReactShowMoreText from "react-show-more-text";

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

  const displayText = (inputText: string) => {
    // Replace newline characters with HTML line breaks
    const formattedText = inputText.replace(/\n/g, "<br>");

    // Set the content using dangerouslySetInnerHTML
    return { __html: formattedText };
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
          <ReactShowMoreText
            className="text-sm text-smoke"
            more={<span className="font-medium cursor-pointer">See more</span>}
            less={<span className="font-medium cursor-pointer">See less</span>}
          >
            <div
              dangerouslySetInnerHTML={displayText(comment.comment || "")}
            ></div>
          </ReactShowMoreText>
        </div>
      </div>
    </div>
  );
};
