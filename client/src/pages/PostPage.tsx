import { CommentCard, SkeletonCommentCard } from "@/components/comment";
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
import { Loader, Send } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const PostPage = () => {
  const { id } = useParams();

  const postQuery = useGetPost(id);
  const commentQuery = useGetComments(id || "", true);
  const commentData = splitPagesData<Comment>(commentQuery.data);

  const post = postQuery.data?.data.data;

  const [comment, setComment] = useState<string | undefined>("");
  const createMutation = useCreateComment();
  const errToast = useErrorToast();

  const onComment = () => {
    if (comment) {
      createMutation.mutateAsync(
        { id: id || "", values: { comment } },
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
      {postQuery.isLoading ? (
        <div className="py-[20px]">
          <SkeletonPostCard />
        </div>
      ) : (
        <PostCard isForPage={true} post={post} />
      )}

      <div className="flex flex-col">
        {!commentQuery.isLoading && (
          <div className="w-ful h-fit flex items-center space-x-[20px] py-[20px]">
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
            commentData?.map((co) => <CommentCard key={co._id} comment={co} />)
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
