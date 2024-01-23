import { CommentBox, SkeletonCommentCard } from "@/components/comment";
import { PostCard, SkeletonPostCard } from "@/components/post";
import { Input } from "@/components/ui/input";
import { useCreateComment, useGetComments } from "@/hooks/query/comment.hooks";
import { useGetPost } from "@/hooks/query/post.hooks";
import useErrorToast from "@/hooks/useErrorToast";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { splitPagesData } from "@/lib/infiniteScroll";
import LoadingButton from "@/shared/others/LoadingButton";
import NoDataPlaceHolder from "@/shared/others/NoDataPlaceHolder";
import { Comment } from "@/types/comment.types";
import { ArrowLeft, Loader, Send, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const PostPage = () => {
  const { id } = useParams();

  const postQuery = useGetPost(id);
  const commentQuery = useGetComments(id || "", true);
  const commentData = splitPagesData<Comment>(commentQuery.data);
  const navigate = useNavigate();

  const post = postQuery.data?.data.data;

  const [comment, setComment] = useState<string | undefined>("");
  const [toReply, setToReply] = useState<Comment | null>(null);
  const createMutation = useCreateComment();
  const errToast = useErrorToast();

  const onComment = () => {
    if (comment) {
      createMutation.mutateAsync(
        { id: id || "", values: { comment, repliedComment: toReply?._id } },
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

  useInfiniteScroll(commentQuery);

  return (
    <div className="w-full min-h-screen relative">
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="flex items-center space-x-[5px] pb-[10px]"
      >
        <ArrowLeft />
        <span>Back</span>
      </button>

      {postQuery.isLoading ? (
        <div className="py-[20px]">
          <SkeletonPostCard />
        </div>
      ) : (
        <PostCard isForPage={true} post={post} />
      )}

      <div className="flex flex-col pt-[20px]">
        {!commentQuery.isLoading && (
          <div>
            {toReply && (
              <div className="text-smoke flex items-center space-x-[5px] px-[10px] pb-[10px]">
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
            <div className="w-ful h-fit flex items-center space-x-[20px] pb-[20px]">
              <Input
                onChange={(el) => setComment(el.target.value)}
                value={comment}
                placeholder="Your comment...."
                className="w-full"
              />
              <LoadingButton
                onClick={onComment}
                disabled={createMutation.isLoading}
                loading={createMutation.isLoading}
                className="w-fit py-[6px]"
              >
                <Send size={20} />
              </LoadingButton>
            </div>
          </div>
        )}
        <div className="space-y-[15px]">
          {commentQuery.isLoading ? (
            <>
              <SkeletonCommentCard />
              <SkeletonCommentCard />
              <SkeletonCommentCard />
              <SkeletonCommentCard />
            </>
          ) : commentData?.length == 0 ? (
            <div className="py-[50px]">
              <NoDataPlaceHolder iconSize={50}>
                No Comments Yet
              </NoDataPlaceHolder>
            </div>
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
      </div>
    </div>
  );
};
