import axiosClient from "@/lib/axios";
import { Post } from "@/types/post.types";
import { Response } from "@/types/response.types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

export const useGetPosts = () =>
  useInfiniteQuery(
    //@ts-ignore
    {
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
    }
  );

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (values) => axiosClient().post("/posts", values),
  });
};
