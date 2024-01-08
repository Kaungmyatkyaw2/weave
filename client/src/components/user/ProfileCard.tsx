import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/user.type";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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

  return (
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
          <p>{user.follower} Followers</p>
          <p>{user.following} Following</p>
        </div>
      </div>
      <Button className="w-full mt-[25px]">
        {currentUser?._id == user._id ? "Edit Profile" : "Follow"}
      </Button>
    </div>
  );
};
