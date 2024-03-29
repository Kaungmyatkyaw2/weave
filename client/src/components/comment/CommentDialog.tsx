import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import LoadingButton from "@/shared/others/LoadingButton";
import { useUpdatePost } from "@/hooks/query/post.hooks";
import { Input } from "../ui/input";
import { Post } from "@/types/post.types";
import { Loader, Send, X } from "lucide-react";
import useErrorToast from "@/hooks/useErrorToast";
import { useCreateComment, useGetComments } from "@/hooks/query/comment.hooks";
import { CommentBox, SkeletonCommentCard } from ".";
import { splitPagesData } from "@/lib/infiniteScroll";
import { Comment } from "@/types/comment.types";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import NoDataPlaceHolder from "@/shared/others/NoDataPlaceHolder";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Prop extends DialogProps {
  isUpdateDialog?: boolean;
  post: Post;
}

export const CommentDialog = ({
  onOpenChange,
  isUpdateDialog,
  post,
  ...props
}: Prop) => {
  const [comment, setComment] = useState<string | undefined>("");
  const divRef = useRef<HTMLDivElement>(null);

  const [toReply, setToReply] = useState<null | Comment>(null);

  const commentQuery = useGetComments(post._id, !!props.open);
  const commentData = splitPagesData<Comment>(commentQuery.data);

  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  const createMutation = useCreateComment();
  const updateMutation = useUpdatePost();

  const errToast = useErrorToast();

  useInfiniteScroll(commentQuery, divRef.current || undefined);

  const onComment = () => {
    if (comment) {
      createMutation.mutateAsync(
        { id: post._id, values: { comment, repliedComment: toReply?._id } },
        {
          onSuccess: () => {
            setComment("");
          },
          onError(error: any) {
            errToast(error, "Failed to comment");
          },
        }
      );
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent
        className={`${isDarkMode ? "dark " : ""} 
      sm:min-w-[50%] min-w-full px-0 bg-white text-black`}
      >
        <DialogHeader className="sm:pl-[10px]">
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="sm:h-[80vh] h-[85vh] w-full sm:px-[30px] px-[10px]">
          <div
            ref={divRef}
            className="w-full h-[85%] overflow-y-scroll styled-scroll py-[10px] space-y-[15px]"
          >
            {commentQuery.isLoading ? (
              <>
                <SkeletonCommentCard />
                <SkeletonCommentCard />
                <SkeletonCommentCard />
                <SkeletonCommentCard />
              </>
            ) : commentData?.length == 0 ? (
              <NoDataPlaceHolder iconSize={50}>
                No Comments Yet
              </NoDataPlaceHolder>
            ) : (
              commentData?.map((co) => (
                <CommentBox
                  onReplyClick={() => {
                    setToReply(co);
                  }}
                  key={co._id}
                  comment={co}
                />
              ))
            )}

            {commentQuery.isFetchingNextPage ? (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="w-full">
            {toReply && (
              <div className="text-smoke flex items-center space-x-[5px] px-[10px] py-[10px]">
                <button
                  onClick={() => {
                    setToReply(null);
                  }}
                >
                  <X size={15} />
                </button>
                <p className="text-sm">Replying to @{toReply.user.userName}</p>
              </div>
            )}
            <div className="w-ful h-[15%] flex items-center space-x-[20px]">
              <Input
                onChange={(el) => setComment(el.target.value)}
                value={comment}
                placeholder="Your comment...."
                className="w-full"
              />
              <LoadingButton
                onClick={onComment}
                disabled={createMutation.isLoading}
                loading={createMutation.isLoading || updateMutation.isLoading}
                className="w-fit py-[6px]"
              >
                <Send size={20} />
              </LoadingButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
