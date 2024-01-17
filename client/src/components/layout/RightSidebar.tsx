import { useGetWhoToFollow } from "@/hooks/query/follow.hooks";
import { Input } from "../ui/input";
import { splitPagesData } from "@/lib/infiniteScroll";
import { User } from "@/types/user.type";
import { Loader } from "lucide-react";
import FollowCard from "../user/FollowCard";
import NoDataPlaceHolder from "@/shared/others/NoDataPlaceHolder";

const RightSidebar = () => {
  const query = useGetWhoToFollow();

  const Users = splitPagesData<User>(query.data);

  return (
    <div className="fixed top-[60px] right-[20px] lg:block hidden w-[calc(30%-20px)] h-screen rounded-sm border  p-[10px]">
      <Input placeholder="Search..." className="w-full" />
      <div className="w-full rounded-md bg-white p-[10px] py-[20px] mt-[40px] space-y-[15px]">
        <h1 className="text-lg font-bold text-smoke">Who to follow?</h1>
        {query.isLoading ? (
          <></>
        ) : Users?.length ? (
          Users?.map((user) => (
            <FollowCard key={user._id} isShowFlBtn user={user} />
          ))
        ) : (
          <NoDataPlaceHolder iconSize={30} className="py-[10px]">
            No Users To Follow
          </NoDataPlaceHolder>
        )}

        {query.isFetchingNextPage || query.isLoading ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <></>
        )}

        {query.hasNextPage && (
          <button
            onClick={() => {
              if (query.hasNextPage) {
                query.fetchNextPage();
              }
            }}
            className="py-[5px] text-sm text-blue-600 flex justify-center"
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
