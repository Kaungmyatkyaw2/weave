import axiosClient from "@/lib/axios";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getNextPageParam,
  updateInfiniteQueryPages,
  useQueryHandler,
} from "./helper";
import { Comment } from "@/types/comment.types";
import { InfiniteQueryResponse } from "@/types/response.types";

export const useGetComments = (id: string, enabled: boolean) =>
  useInfiniteQuery({
    queryKey: ["comments", id],
    queryFn: ({ pageParam = 1 }) =>
      axiosClient()
        .get(`/posts/${id}/comments?page=${pageParam}`)
        .then((res) => res.data),
    getNextPageParam: getNextPageParam<Comment>(),
    enabled,
  });

export const useCreateComment = () => {
  const { handleCreateInfiniteQuery } = useQueryHandler();
  const queryClient = useQueryClient();

  interface Body {
    id: string;
    values: any;
  }

  return useMutation({
    mutationFn: ({ id, values }: Body) =>
      axiosClient().post(`/posts/${id}/comments`, values),
    onSuccess: (res, payload) => {
      const createdComment: Comment = res.data.data.data;

      if (payload.values.repliedComment) {
        let prevCache: undefined | InfiniteQueryResponse<Comment> =
          queryClient.getQueryData(["comments", payload.id]);

        if (prevCache) {
          prevCache = updateInfiniteQueryPages<Comment>(
            prevCache,
            payload.values.repliedComment,
            (toUpdate) => {
              const updatedReplies = [
                ...(toUpdate.replies || []),
                createdComment,
              ];

              return { ...toUpdate, replies: updatedReplies };
            }
          );
        }

        queryClient.setQueryData(["comments", payload.id], prevCache);
      } else {
        handleCreateInfiniteQuery<Comment>(
          ["comments", payload.id],
          createdComment
        );
      }
    },
  });
};

export const useDeleteComment = () => {
  const { handleDeleteQuery } = useQueryHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comment }: { comment: Comment; postId: string }) =>
      axiosClient().delete(`/comments/${comment._id}`),
    onSuccess: (_, { postId, comment }) => {
      if (comment.isReply) {
        let prevCache: undefined | InfiniteQueryResponse<Comment> =
          queryClient.getQueryData(["comments", postId]);

        if (prevCache) {
          prevCache = updateInfiniteQueryPages<Comment>(
            prevCache,
            comment.repliedComment || "",
            (toUpdate) => {
              const updatedReplies = toUpdate.replies?.filter(
                (a) => a._id != comment._id
              );

              return { ...toUpdate, replies: updatedReplies };
            }
          );
        }

        queryClient.setQueryData(["comments", postId], prevCache);
      } else {
        handleDeleteQuery<Comment>(["comments", comment.post], comment._id);
      }
    },
  });
};
