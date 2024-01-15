import { DialogProps } from "@radix-ui/react-alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useGetFollowers, useGetFollowings } from "@/hooks/query/follow.hooks";
import { Follow, User } from "@/types/user.type";
import { useRef } from "react";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Loader } from "lucide-react";
import { splitPagesData } from "@/lib/infiniteScroll";
import FollowCard from "./FollowCard";

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

  const follows = splitPagesData<Follow>(query.data);

  useInfiniteScroll(query, dialogRef.current || undefined);

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogContent ref={dialogRef} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {user.displayName}'s
            {isForFollower ? "  Followers" : "  Followings"}
          </DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-[10px]">
          {query.isLoading ? (
            <></>
          ) : follows?.length ? (
            follows?.map((follow) => (
              <FollowCard
                to={""}
                onClick={() => {
                  onOpenChange?.(false);
                }}
                key={follow._id}
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
