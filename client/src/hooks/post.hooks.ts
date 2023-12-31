import axiosClient from "@/lib/axios";
import { Post } from "@/types/post.types";
import { InfiniteQueryResponse, Response } from "@/types/response.types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => axiosClient().post("/posts", values),
    onSuccess: (res) => {
      const createdPost = res.data.data.data;
      const prevCachedContacts: InfiniteQueryResponse<Post> | undefined =
        queryClient.getQueryData(["posts"], {
          exact: true,
        });

      console.log(createdPost);

      if (prevCachedContacts) {
        prevCachedContacts.pages[0].data.data.unshift(createdPost);
      }

      queryClient.setQueryData(["contacts"], prevCachedContacts);
    },
  });
};
