import axiosClient from "@/lib/axios";
import { Post } from "@/types/post.types";
import { Response } from "@/types/response.types";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetContacts = () =>
  useInfiniteQuery(
    //@ts-ignore
    {
      queryKey: ["posts"],
      queryFn: ({ pageParam = 1 }) =>
        axiosClient()
          .get(`/posts?page=${pageParam}&limit=2`)
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
