import { Comment } from "@/types/comment.types";
import { Post } from "@/types/post.types";
import { InfiniteQueryResponse, Response } from "@/types/response.types";
import { Follow, User } from "@/types/user.type";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

export const updateInfiniteQueryPages = <T extends Post | Comment | User>(
  prevData: InfiniteQueryResponse<T>,
  id: string,
  toUpdateFunction: (toUpdate: T) => T
) => {
  let pages = prevData.pages;

  pages = pages.map((el) => ({
    ...el,
    data: {
      data: el.data.data.map((de) =>
        de._id == id ? toUpdateFunction(de) : de
      ),
    },
  }));

  prevData = {
    ...prevData,
    pages,
  };

  return prevData;
};

export const updateFollowInfiniteQueryPages = <T extends Follow>(
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

export const updateInfiniteQueryPagesOnDelete = <
  T extends Post | Follow | Comment
>(
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

export const updateQueryFollow = (
  queryClient: QueryClient,
  queryKey: string[],
  userId: string,
  field: "followerUser" | "followingUser",
  followId?: string
) => {
  let prevCachedFollows: InfiniteQueryResponse<Follow> | undefined =
    queryClient.getQueryData(queryKey);

  if (prevCachedFollows) {
    prevCachedFollows = {
      ...prevCachedFollows,
      pages: prevCachedFollows.pages.map((followPage) => ({
        ...followPage,
        data: {
          data: followPage.data.data.map((follow) => {
            if (follow[field]._id == userId) {
              return {
                ...follow,
                [field]: {
                  ...follow[field],
                  followId: followId,
                },
              };
            }

            return follow;
          }),
        },
      })),
    };
  }

  queryClient.setQueryData(queryKey, prevCachedFollows);
};

export const updateQuerySearchUsers = (
  queryClient: QueryClient,
  followUserId: string,
  context: string,
  followId?: string
) => {
  let prevCachedFollows: InfiniteQueryResponse<User> | undefined =
    queryClient.getQueryData(["users", "search", context]);

  if (prevCachedFollows) {
    prevCachedFollows = {
      ...prevCachedFollows,
      pages: prevCachedFollows.pages.map((el) => ({
        ...el,
        data: {
          data: el.data.data.map((cc) => {
            if (cc._id == followUserId) {
              return {
                ...cc,
                followId,
              };
            }

            return cc;
          }),
        },
      })),
    };
  }

  queryClient.setQueryData(["users", "search", context], prevCachedFollows);
};

export const getNextPageParam = <T extends Follow | Post | Comment | User>(
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

  const handleDeleteQuery = <T extends Post | Follow | Comment>(
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

  const handleCreateInfiniteQuery = <T extends Post | Follow | Comment>(
    queryKey: string[],
    createdData: T
  ) => {
    let prevCache: undefined | InfiniteQueryResponse<T> =
      queryClient.getQueryData(queryKey);
    if (prevCache) {
      prevCache = JSON.parse(JSON.stringify(prevCache));
      prevCache?.pages[0].data.data.unshift(createdData);
    }

    queryClient.setQueryData(queryKey, prevCache);
  };

  return { handleDeleteQuery, handleCreateInfiniteQuery };
};
