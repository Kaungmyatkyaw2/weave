import UserAvatar from "../user/UserAvatar";
import ReactTimeAgo from "react-time-ago";
import { Comment } from "@/types/comment.types";

import { Reply, Trash } from "lucide-react";
import { useDeleteComment } from "@/hooks/query/comment.hooks";
import useErrorToast from "@/hooks/useErrorToast";
import { useToast } from "../ui/use-toast";
import ReactShowMoreText from "react-show-more-text";
import MoreOptions from "@/shared/others/MoreOptions";
import { useState } from "react";

const CommentCard = ({
  comment,
  onReplyClick,
  isForReplies,
}: {
  comment: Comment;
  onReplyClick?: any;
  isForReplies?: boolean;
}) => {
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
    const formattedText = inputText.replace(/\n/g, "<br>");

    return { __html: formattedText };
  };

  return (
    <div
      className={`py-[10px] ${
        deleteMutation.isLoading ? "opacity-80 cursor-not-allowed" : ""
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
            <MoreOptions
              actions={[{ icon: Trash, text: "Delete", onClick: onDelete }]}
            />
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

          {!isForReplies && (
            <div>
              <button
                onClick={() => {
                  onReplyClick();
                }}
                className="text-smoke flex items-center space-x-[5px] pt-[5px]"
              >
                <Reply size={18} />
                <span className="text-[13px]">Reply</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CommentBox = ({
  comment,
  onReplyClick,
}: {
  comment: Comment;
  onReplyClick?: any;
}) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="w-full border p-[10px]">
      <CommentCard comment={comment} onReplyClick={onReplyClick} />
      {showReplies ? (
        <div className="pl-[40px] pt-[10px] space-y-[10px]">
          {comment.replies?.map((co) => (
            <CommentCard
              key={co._id}
              isForReplies
              comment={co}
              onReplyClick={onReplyClick}
            />
          ))}
        </div>
      ) : (
        <></>
      )}
      {comment.replies?.length ? (
        <button
          onClick={() => {
            setShowReplies(!showReplies);
          }}
          className="text-sm text-gray-600 p-[10px] pl-[20px] cursor-pointer w-fit"
        >
          ....{showReplies ? "Hide replies" : "See replies"}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};
