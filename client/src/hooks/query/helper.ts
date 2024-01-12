import { Post } from "@/types/post.types";
import { InfiniteQueryResponse, Response } from "@/types/response.types";
import { Follow } from "@/types/user.type";
import { useQueryClient } from "@tanstack/react-query";

export const updateInfiniteQueryPages = <T extends Post>(
  prevData: InfiniteQueryResponse<T>,
  data: T
) => {
  let pages = prevData.pages;

  pages = pages.map((el) => ({
    ...el,
    data: {
      data: el.data.data.map((de) => (de._id == data._id ? data : de)),
    },
  }));

  prevData = {
    ...prevData,
    pages,
  };

  return prevData;
};

export const updateInfiniteQueryPagesOnDelete = <T extends Post | Follow>(
  prevData: InfiniteQueryResponse<T>,
  id: string
) => {
  let pages = prevData.pages;

  pages = pages.map((el) => ({
    ...el,
    data: {
      data: el.data.data.filter((de) => de._id != id),
    },
  }));

  prevData = {
    ...prevData,
    pages,
  };

  return prevData;
};

export const getNextPageParam = <T extends Follow | Post>(
  limit: number = 10
) => {
  return (lastPage: Response<T[]>, allPages: any) => {
    if (lastPage.result < limit) {
      return undefined;
    } else {
      return allPages.length + 1;
    }
  };
};

export const useQueryHandler = () => {
  const queryClient = useQueryClient();

  const handleDeleteQuery = <T extends Post | Follow>(
    queryKey: string[],
    toDelete: string | undefined
  ) => {
    let prevCache: undefined | InfiniteQueryResponse<T> =
      queryClient.getQueryData(queryKey);

    if (prevCache) {
      prevCache = updateInfiniteQueryPagesOnDelete<T>(
        prevCache,
        toDelete || ""
      );
    }

    queryClient.setQueryData(queryKey, prevCache);
  };

  const handleCreateInfiniteQuery = <T extends Post | Follow>(
    queryKey: string[],
    createdData: T
  ) => {
    let prevCache: undefined | InfiniteQueryResponse<T> =
      queryClient.getQueryData(queryKey);
    prevCache = JSON.parse(JSON.stringify(prevCache));
    if (prevCache) {
      prevCache?.pages[0].data.data.unshift(createdData);
    }

    queryClient.setQueryData(queryKey, prevCache);
  };

  return { handleDeleteQuery, handleCreateInfiniteQuery };
};
