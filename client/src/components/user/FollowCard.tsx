import { User } from "@/types/user.type";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import { Button } from "../ui/button";
import { useCreateFollow, useDeleteFollow } from "@/hooks/query/follow.hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useErrorToast from "@/hooks/useErrorToast";
import { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  user: User;
  isAlreadyFollow?: boolean;
  followId?: string;
  onUnFollowSuccess?: any;
  onFollowSuccess?: any;
}

const FollowCard = ({
  user,
  isAlreadyFollow,
  onClick,
  followId,
  className,
  onUnFollowSuccess,
  onFollowSuccess,
  ...props
}: Props) => {
  const createMutation = useCreateFollow();
  const deleteMutation = useDeleteFollow();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const errToast = useErrorToast();

  const navigate = useNavigate();

  const onFollow = () => {
    const payload = {
      followingUser: user._id,
      followerUser: currentUser?._id,
    };
    createMutation.mutateAsync(payload, {
      onSuccess(res) {
        onFollowSuccess(res.data.data.data);
      },
      onError(error: any) {
        errToast(error, "Failed to follow.");
      },
    });
  };

  const onUnfollow = () => {
    const payload = {
      followId: followId,
      followingUser: user._id,
    };
    deleteMutation.mutateAsync(payload, {
      onSuccess() {
        onUnFollowSuccess?.(user._id);
      },
      onError(error: any) {
        errToast(error, "Failed to Unfollow.");
      },
    });
  };
  return (
    <div
      {...props}
      onClick={(e) => {
        navigate(`/user/${user._id}`);
        onClick?.(e);
      }}
      className={`flex items-center space-x-[10px] cursor-pointer bg-gray-50 dark:bg-primary py-[10px] px-[10px] rounded-[10px] ${className}`}
    >
      <UserAvatar className=" w-[60px] h-[60px]" user={user} />

      <div className=" w-full space-y-[5px]">
        <h1 className="font-bold">{user?.displayName}</h1>
        <p className="text-sm">@{user?.userName}</p>
      </div>
      {currentUser?._id != user._id && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            isAlreadyFollow ? onUnfollow() : onFollow();
          }}
          className="w-full text-[14px] py-[2px] px-[5px] rounded-full border dark:border-gray-500 bg-gray-50 dark:bg-primary text-smoke hover:opacity-90 disabled:opacity-80"
          disabled={createMutation.isLoading || deleteMutation.isLoading}
        >
          {isAlreadyFollow ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  );
};

export default FollowCard;
