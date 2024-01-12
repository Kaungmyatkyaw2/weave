import axiosClient from "@/lib/axios";
import { updateFollow } from "@/store/slice/user.slice";
import { RootState } from "@/store/store";
import { Response } from "@/types/response.types";
import { Follow, User } from "@/types/user.type";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getNextPageParam, useQueryHandler } from "./helper";

export const useGetFollowers = (id: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["followers", id],
    queryFn: ({ pageParam = 1 }) =>
      axiosClient()
        .get(`/follows?followingUser=${id}&page=${pageParam}`)
        .then((res) => res.data),
    getNextPageParam: getNextPageParam<Follow>(),
  });
};

export const useGetFollowings = (id: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["followings", id],
    queryFn: ({ pageParam = 1 }) =>
      axiosClient()
        .get(`/follows?followerUser=${id}&page=${pageParam}`)
        .then((res) => res.data),
    getNextPageParam: getNextPageParam<Follow>(),
  });
};

export const useCreateFollow = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const { handleCreateInfiniteQuery } = useQueryHandler();

  return useMutation({
    mutationFn: (values: any) => axiosClient().post("/follows", values),
    onSuccess(res: AxiosResponse<Response<Follow>>, val) {
      dispatch(updateFollow("add"));

      handleCreateInfiniteQuery(
        ["followings", currentUser?._id || ""],
        res.data.data.data
      );
      handleCreateInfiniteQuery(
        ["followers", res.data.data.data.followingUser._id || ""],
        res.data.data.data
      );

      const prevCachedUser: undefined | Response<User> =
        queryClient.getQueryData(["user", val.followingUser]);

      if (prevCachedUser) {
        prevCachedUser.data.data.follower += 1;
        prevCachedUser.data.data.followId = res.data.data.data._id;
      }

      queryClient.setQueryData(["user", val.followingUser], prevCachedUser);
    },
  });
};

export const useDeleteFollow = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const { handleDeleteQuery } = useQueryHandler();

  return useMutation({
    mutationFn: (payload: { followId?: string; followingUser: string }) => {
      return axiosClient().delete(`/follows/${payload.followId}`);
    },
    onSuccess(_, payload) {
      dispatch(updateFollow("remove"));

      handleDeleteQuery<Follow>(
        ["followings", currentUser?._id || ""],
        payload.followId
      );
      handleDeleteQuery<Follow>(
        ["followers", payload.followingUser || ""],
        payload.followId
      );

      const prevCachedUser: undefined | Response<User> =
        queryClient.getQueryData(["user", payload.followingUser]);

      if (prevCachedUser) {
        prevCachedUser.data.data.follower -= 1;
        prevCachedUser.data.data.followId = undefined;
      }

      queryClient.setQueryData(["user", payload.followingUser], prevCachedUser);
    },
  });
};
