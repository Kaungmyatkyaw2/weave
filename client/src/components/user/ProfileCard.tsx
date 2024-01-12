import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/user.type";
import { Skeleton } from "../ui/skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useCreateFollow, useDeleteFollow } from "@/hooks/query/follow.hooks";
import LoadingButton from "@/shared/others/LoadingButton";
import { useState } from "react";
import ProfileUpdateDialog from "./ProfileUpdateDialog";
import FollowerDialog from "./FollowerDialog";
import useErrorToast from "@/hooks/useErrorToast";

export const ProfileSkeletonCard = () => {
  return (
    <div className="w-full border py-[20px] px-[20px] rounded-[10px]">
      <div className="flex items-center justify-between">
        <div className=" w-full">
          <Skeleton className="h-[2rem] w-[70%]" />
          <Skeleton className="h-[16px] w-[50%] mt-[10px]" />
        </div>
        <div className="w-[80px]">
          <Skeleton className="w-[75px] h-[75px] rounded-full"></Skeleton>
        </div>
      </div>
      <div className="space-y-[5px] mt-[25px]">
        <Skeleton className="h-[16px] w-[50%]" />
        <div className="flex gap-2">
          <Skeleton className="h-[16px] w-[50px]" />
          <Skeleton className="h-[16px] w-[50px]" />
        </div>
      </div>
      <Skeleton className="mt-[25px] h-[3rem] w-full" />
    </div>
  );
};

export const ProfileCard = ({ user }: { user: User }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [editOpen, setEditOpen] = useState(false);
  const [FollowerDialogOpen, setFollowerDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);

  const isMe = currentUser?._id == user._id;
  const createMutation = useCreateFollow();
  const deleteMutation = useDeleteFollow();
  const errToast = useErrorToast();

  const onFollow = () => {
    const payload = {
      followingUser: user._id,
      followerUser: currentUser?._id,
    };
    createMutation.mutateAsync(payload, {
      onError(error: any) {
        errToast(error, "Failed to follow.");
      },
    });
  };

  const onUnfollow = () => {
    const payload = {
      followId: user.followId,
      followingUser: user._id,
    };
    deleteMutation.mutateAsync(payload, {
      onError(error: any) {
        errToast(error,"Failed to Unfollow.");
      },
    });
  };

  return (
    <>
      <ProfileUpdateDialog open={editOpen} onOpenChange={setEditOpen} />
      <FollowerDialog
        isForFollower
        user={user}
        open={FollowerDialogOpen}
        onOpenChange={setFollowerDialogOpen}
      />
      <FollowerDialog
        user={user}
        open={followingDialogOpen}
        onOpenChange={setFollowingDialogOpen}
      />
      <div className="w-full bg-gray-50 py-[20px] px-[20px] rounded-[10px]">
        <div className="flex items-center justify-between">
          <div className=" w-full">
            <h1 className="font-bold text-2xl">{user?.displayName}</h1>
            <p className="text-md">@{user?.userName}</p>
          </div>

          <Avatar className="w-[75px] h-[75px]">
            <AvatarFallback className="bg-green-500 text-2xl">
              {user?.displayName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-[5px] mt-[25px]">
          <h1 className="text-[15px] text-gray-500">No More Boiler Plate</h1>
          <div className="flex gap-4 items-center text-sm text-gray-500">
            <button
              onClick={() => {
                setFollowerDialogOpen(true);
              }}
            >
              {user.follower} Followers
            </button>
            <button
              onClick={() => {
                setFollowingDialogOpen(true);
              }}
            >
              {user.following} Following
            </button>
          </div>
        </div>
        <LoadingButton
          loading={createMutation.isLoading || deleteMutation.isLoading}
          onClick={
            isMe
              ? () => {
                  setEditOpen(true);
                }
              : user.followId
              ? onUnfollow
              : onFollow
          }
          className="w-full mt-[25px] text-[15px] py-[25px]"
        >
          {isMe ? "Edit Profile" : user.followId ? "Unfollow" : "Follow"}
        </LoadingButton>
      </div>
    </>
  );
};
