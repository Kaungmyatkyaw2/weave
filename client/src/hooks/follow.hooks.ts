import axiosClient from "@/lib/axios";
import { updateFollow } from "@/store/slice/user.slice";
import { Response } from "@/types/response.types";
import { Follow, User } from "@/types/user.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";

export const useCreateFollow = () => {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: any) => axiosClient().post("/follows", values),
    onSuccess(res: AxiosResponse<Response<Follow>>, val) {
      dispatch(updateFollow("add"));

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

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { followId?: string; followingUser: string }) => {
      return axiosClient().delete(`/follows/${payload.followId}`);
    },
    onSuccess(_, payload) {
      dispatch(updateFollow("remove"));

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
