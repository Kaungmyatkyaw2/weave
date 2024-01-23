import axiosClient from "@/lib/axios";
import { Post } from "@/types/post.types";
import { InfiniteQueryResponse, Response } from "@/types/response.types";
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
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

const updateInfiniteQueryPosts = (
  queryClient: QueryClient,
  queryKey: string[],
  updatedPost: Post
) => {
  let prevCachedPosts: InfiniteQueryResponse<Post> | undefined =
    queryClient.getQueryData(queryKey, {
      exact: true,
    });

  if (prevCachedPosts) {
    prevCachedPosts = updateInfiniteQueryPages<Post>(
      prevCachedPosts,
      updatedPost._id,
      () => updatedPost
    );
  }

  queryClient.setQueryData(queryKey, prevCachedPosts);
};

const updatePost = (
  queryClient: QueryClient,
  queryKey: string[],
  updatedPost: Post
) => {
  let prevCachedPost: Response<Post> | undefined = queryClient.getQueryData(
    queryKey,
    {
      exact: true,
    }
  );

  if (prevCachedPost) {
    prevCachedPost = { ...prevCachedPost, data: { data: updatedPost } };
  }

  queryClient.setQueryData(queryKey, prevCachedPost);
};

export const useGetPosts = () =>
  useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) =>
      axiosClient()
        .get(`/posts?page=${pageParam}`)
        .then((res) => res.data),
    getNextPageParam: getNextPageParam<Post>(),
  });

export const useGetPost = (id: string | undefined) =>
  useQuery({
    queryKey: ["post", id],
    queryFn: () =>
      axiosClient()
        .get(`/posts/${id}`)
        .then((res) => res.data),
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

export const useSearchPosts = (search: string | undefined) =>
  useInfiniteQuery({
    queryKey: ["posts", "search", search],
    queryFn: ({ pageParam }) =>
      axiosClient()
        .get(`/posts/search?search=${search}&page=${pageParam}`)
        .then((res) => res.data),
    getNextPageParam: getNextPageParam<Post>(10),
    cacheTime: 0,
    staleTime: 0,
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
    onSuccess: (res: AxiosResponse<Response<Post>>, payload) => {
      const updatedPost = res.data.data.data;

      updateInfiniteQueryPosts(queryClient, ["posts"], updatedPost);
      updatePost(queryClient, ["post", payload.id], updatedPost);
      updateInfiniteQueryPosts(
        queryClient,
        ["posts", res.data.data.data.user._id],
        updatedPost
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
