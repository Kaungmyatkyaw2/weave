import axiosClient from "@/lib/axios";
import { updateFollow } from "@/store/slice/user.slice";
import { RootState } from "@/store/store";
import { Response } from "@/types/response.types";
import { Follow, User } from "@/types/user.type";
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getNextPageParam, useQueryHandler } from "./helper";

interface Payload {
  field: "follower" | "following";
  followId?: string;
  isDecrease?: boolean;
}
const incDrcFollow = (
  queryClient: QueryClient,
  queryKey: string[],
  payload: Payload
) => {
  const prevCachedUser: undefined | Response<User> =
    queryClient.getQueryData(queryKey);

  if (prevCachedUser) {
    if (payload.isDecrease) {
      prevCachedUser.data.data[payload.field] -= 1;
    } else {
      prevCachedUser.data.data[payload.field] += 1;
    }

    prevCachedUser.data.data.followId = payload.followId;
  }

  queryClient.setQueryData(queryKey, prevCachedUser);
};

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

export const useGetWhoToFollow = () => {
  return useInfiniteQuery({
    queryKey: ["whoToFollow"],
    queryFn: ({ pageParam = 1 }) =>
      axiosClient()
        .get(`/users/whotofollow?page=${pageParam}`)
        .then((res) => res.data),
    getNextPageParam: getNextPageParam<User>(),
  });
};

export const useCreateFollow = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const { handleCreateInfiniteQuery, handleDeleteQuery } = useQueryHandler();

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

      handleDeleteQuery(["whoToFollow"], res.data.data.data.followingUser._id);

      incDrcFollow(queryClient, ["user", val.followingUser], {
        field: "follower",
        followId: res.data.data.data._id,
      });

      incDrcFollow(queryClient, ["user", currentUser?._id || ""], {
        field: "following",
      });
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

      incDrcFollow(queryClient, ["user", payload.followingUser], {
        field: "follower",
        isDecrease: true,
      });

      incDrcFollow(queryClient, ["user", currentUser?._id || ""], {
        field: "following",
        isDecrease: true,
      });
    },
  });
};
