import axiosClient from "@/lib/axios";
import { Post } from "@/types/post.types";
import { InfiniteQueryResponse, Response } from "@/types/response.types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  updateInfiniteQueryPages,
  updateInfiniteQueryPagesOnDelete,
} from "./helper";

export const useGetPosts = () =>
  useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) =>
      axiosClient()
        .get(`/posts?page=${pageParam}`)
        .then((res) => res.data),
    getNextPageParam: (lastPage: Response<Post[]>, allPages: any) => {
      if (lastPage.result < 2) {
        return undefined;
      } else {
        return allPages.length + 1;
      }
    },
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => axiosClient().post("/posts", values),
    onSuccess: (res) => {
      const createdPost = res.data.data.data;
      const cachedPosts: InfiniteQueryResponse<Post> | undefined =
        queryClient.getQueryData(["posts"], {
          exact: true,
        });

      const prevCachedPosts = JSON.parse(JSON.stringify(cachedPosts));

      if (prevCachedPosts) {
        prevCachedPosts.pages[0].data.data.unshift(createdPost);
      }

      queryClient.setQueryData(["posts"], prevCachedPosts);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) =>
      axiosClient().patch(`/posts/${payload.id}`, payload.values),
    onSuccess: (res) => {
      const updatedPost = res.data.data.data;
      let prevCachedPosts: InfiniteQueryResponse<Post> | undefined =
        queryClient.getQueryData(["posts"], {
          exact: true,
        });

      if (prevCachedPosts) {
        prevCachedPosts = updateInfiniteQueryPages<Post>(
          prevCachedPosts,
          updatedPost
        );
      }

      queryClient.setQueryData(["posts"], prevCachedPosts);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => axiosClient().delete(`/posts/${payload._id}`),
    onSuccess: (_, post: Post) => {
      let prevCachedPosts: InfiniteQueryResponse<Post> | undefined =
        queryClient.getQueryData(["posts"], {
          exact: true,
        });

      if (prevCachedPosts) {
        prevCachedPosts = updateInfiniteQueryPagesOnDelete(
          prevCachedPosts,
          post._id
        );
      }

      queryClient.setQueryData(["posts"], prevCachedPosts);
    },
  });
};
