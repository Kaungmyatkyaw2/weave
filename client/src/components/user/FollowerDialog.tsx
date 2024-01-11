import { DialogProps } from "@radix-ui/react-alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useGetFollowers, useGetFollowings } from "@/hooks/user.hooks";
import { User } from "@/types/user.type";
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

  const follows = splitPagesData(query.data);

  useInfiniteScroll(query, dialogRef.current || undefined);

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogContent ref={dialogRef} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isForFollower ? "Followers" : "Followings"}
          </DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-[10px]">
          {!query.isLoading && follows?.length ? (
            follows?.map((follow) => (
              <FollowCard
                user={
                  isForFollower ? follow.followerUser : follow.followingUser
                }
              />
            ))
          ) : (
            <div className="flex justify-center pt-[20px]"> No follows</div>
          )}

          {query.isFetchingNextPage && (
            <div className="flex items-center py-[10px]">
              <Loader className="animate-spin" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowerDialog;
