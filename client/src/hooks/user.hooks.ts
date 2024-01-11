import axiosClient from "@/lib/axios";
import { updateUserInfo } from "@/store/slice/user.slice";
import { RootState } from "@/store/store";
import { Response } from "@/types/response.types";
import { Follow, User } from "@/types/user.type";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";

export const useGetUser = (id: string | undefined) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      axiosClient()
        .get(`/users/${id}`)
        .then((res) => res.data),
  });

export const useUpdateMe = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) =>
      axiosClient().patch(`/users/updateMe`, payload),
    onSuccess: (res: AxiosResponse<Response<User>>, Info) => {
      dispatch(updateUserInfo(Info));
      const prevCachedData: Response<User> | undefined =
        queryClient.getQueryData(["user", currentUser?._id]);

      if (prevCachedData) {
        prevCachedData.data.data.displayName = res.data.data.data.displayName;
        prevCachedData.data.data.userName = res.data.data.data.userName;
      }

      queryClient.setQueryData(["user", currentUser?._id], prevCachedData);
    },
  });
};

export const useGetFollowers = (id: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["followers", id],
    queryFn: ({ pageParam = 1 }) =>
      axiosClient()
        .get(`/follows?followingUser=${id}&page=${pageParam}`)
        .then((res) => res.data),
    getNextPageParam: (lastPage: Response<Follow[]>, allPages: any) => {
      if (lastPage.result < 2) {
        return undefined;
      } else {
        return allPages.length + 1;
      }
    },
  });
};

export const useGetFollowings = (id: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["followings", id],
    queryFn: ({ pageParam = 1 }) =>
      axiosClient()
        .get(`/follows?followerUser=${id}&page=${pageParam}`)
        .then((res) => res.data),
    getNextPageParam: (lastPage: Response<Follow[]>, allPages: any) => {
      if (lastPage.result < 2) {
        return undefined;
      } else {
        return allPages.length + 1;
      }
    },
  });
};
