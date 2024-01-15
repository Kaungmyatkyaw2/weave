import axiosClient from "@/lib/axios";
import { Post } from "@/types/post.types";
import { InfiniteQueryResponse, Response } from "@/types/response.types";
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
import { AxiosResponse } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useGetPosts = () =>
  useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) =>
      axiosClient()
        .get(`/posts?page=${pageParam}`)
        .then((res) => res.data),
    getNextPageParam: getNextPageParam<Post>(),
  });

export const useGetPostsByUser = (userId: string | undefined) =>
  useInfiniteQuery({
    queryKey: ["posts", userId],
    queryFn: ({ pageParam = 1 }) =>
      axiosClient()
        .get(`/users/${userId}/posts?page=${pageParam}`)
        .then((res) => res.data),
    getNextPageParam: getNextPageParam<Post>(),
    enabled: !!userId,
  });

export const useCreatePost = () => {
  const { handleCreateInfiniteQuery } = useQueryHandler();

  return useMutation({
    mutationFn: (values) => axiosClient().post("/posts", values),
    onSuccess: (res) => {
      const createdPost: Post = res.data.data.data;
      handleCreateInfiniteQuery<Post>(["posts"], createdPost);
      handleCreateInfiniteQuery<Post>(
        ["posts", createdPost.user._id],
        createdPost
      );
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) =>
      axiosClient().patch(`/posts/${payload.id}`, payload.values),
    onSuccess: (res: AxiosResponse<Response<Post>>) => {
      const updatedPost = res.data.data.data;
      let prevCachedPosts: InfiniteQueryResponse<Post> | undefined =
        queryClient.getQueryData(["posts"], {
          exact: true,
        });

      let prevCachedPostsUser: InfiniteQueryResponse<Post> | undefined =
        queryClient.getQueryData(["posts", res.data.data.data.user._id], {
          exact: true,
        });

      if (prevCachedPosts) {
        prevCachedPosts = updateInfiniteQueryPages<Post>(
          prevCachedPosts,
          updatedPost
        );
      }

      if (prevCachedPostsUser) {
        prevCachedPostsUser = updateInfiniteQueryPages<Post>(
          prevCachedPostsUser,
          updatedPost
        );
      }

      queryClient.setQueryData(["posts"], prevCachedPosts);
      queryClient.setQueryData(
        ["posts", res.data.data.data.user._id],
        prevCachedPostsUser
      );
    },
  });
};

export const useDeletePost = () => {
  const { handleDeleteQuery } = useQueryHandler();
  const { currentUser } = useSelector((state: RootState) => state.user);

  return useMutation({
    mutationFn: (payload: any) => axiosClient().delete(`/posts/${payload._id}`),
    onSuccess: (_, post: Post) => {
      handleDeleteQuery<Post>(["posts"], post._id);
      handleDeleteQuery<Post>(["posts", currentUser?._id || ""], post._id);
    },
  });
};
