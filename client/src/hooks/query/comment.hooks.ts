import axiosClient from "@/lib/axios";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { getNextPageParam, useQueryHandler } from "./helper";
import { Comment } from "@/types/comment.types";

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

  interface Body {
    id: string;
    values: any;
  }

  return useMutation({
    mutationFn: ({ id, values }: Body) =>
      axiosClient().post(`/posts/${id}/comments`, values),
    onSuccess: (res, payload) => {
      const createdComment: Comment = res.data.data.data;
      handleCreateInfiniteQuery<Comment>(
        ["comments", payload.id],
        createdComment
      );
    },
  });
};

export const useDeleteComment = () => {
  const { handleDeleteQuery } = useQueryHandler();

  return useMutation({
    mutationFn: (payload: Comment) =>
      axiosClient().delete(`/comments/${payload._id}`),
    onSuccess: (_, comment) => {
      handleDeleteQuery<Comment>(["comments", comment.post], comment._id);
    },
  });
};
