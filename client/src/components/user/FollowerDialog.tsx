import { DialogProps } from "@radix-ui/react-alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useGetFollowers, useGetFollowings } from "@/hooks/query/follow.hooks";
import { Follow, User } from "@/types/user.type";
import { useRef } from "react";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Loader } from "lucide-react";
import { splitPagesData } from "@/lib/infiniteScroll";
import FollowCard from "./FollowCard";
import { useQueryClient } from "@tanstack/react-query";
import { updateQueryFollow } from "@/hooks/query/helper";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const FollowerDialog = ({
  onOpenChange,
  user,
  isForFollower,
  ...props
}: DialogProps & { user: User; isForFollower?: boolean }) => {
  const query = isForFollower
    ? useGetFollowers(user._id)
    : useGetFollowings(user._id);
  const dialogRef = useRef<HTMLDivElement>(null);

  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  const queryClient = useQueryClient();

  const follows = splitPagesData<Follow>(query.data);

  useInfiniteScroll(query, dialogRef.current || undefined);

  const onFollowSuccess = (follow: Follow) => {
    const field = isForFollower ? "followerUser" : "followingUser";
    const key = isForFollower ? "followers" : "followings";

    updateQueryFollow(
      queryClient,
      [key, user._id || ""],
      follow.followingUser._id,
      field,
      follow._id
    );
  };

  const onUnFollowSuccess = (followUserId: string) => {
    const field = isForFollower ? "followerUser" : "followingUser";
    const key = isForFollower ? "followers" : "followings";

    updateQueryFollow(queryClient, [key, user._id || ""], followUserId, field);
  };

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogContent
        ref={dialogRef}
        className={`${
          isDarkMode ? "dark " : ""
        } sm:max-w-[425px] bg-white text-black`}
      >
        <DialogHeader>
          <DialogTitle>
            {user.displayName}'s
            {isForFollower ? "  Followers" : "  Followings"}
          </DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-[10px] max-h-[80vh] overflow-y-scroll">
          {query.isLoading ? (
            <></>
          ) : follows?.length ? (
            follows?.map((follow) => (
              <FollowCard
                onClick={() => {
                  onOpenChange?.(false);
                }}
                onFollowSuccess={onFollowSuccess}
                onUnFollowSuccess={onUnFollowSuccess}
                key={follow._id}
                isAlreadyFollow={
                  !!follow.followerUser.followId ||
                  !!follow.followingUser.followId
                }
                followId={
                  follow.followerUser.followId || follow.followingUser.followId
                }
                user={
                  isForFollower ? follow.followerUser : follow.followingUser
                }
              />
            ))
          ) : (
            <div className="flex justify-center pt-[20px]">
              {" "}
              No {isForFollower ? "followers" : "followings"}
            </div>
          )}

          {query.isFetchingNextPage ||
            (query.isLoading && (
              <div className="flex justify-center py-[10px]">
                <Loader className="animate-spin" />
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowerDialog;
