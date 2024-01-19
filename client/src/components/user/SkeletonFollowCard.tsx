import { Skeleton } from "../ui/skeleton";

const SkeletonFollowCard = () => {
  return (
    <div
      className={`flex items-center space-x-[10px] cursor-pointer bg-gray-50 py-[10px] px-[10px] rounded-[10px]`}
    >
      <Skeleton className=" w-[60px] h-[60px] rounded-full" />

      <div className=" w-full space-y-[5px]">
        <Skeleton className=" w-[150px] h-2 rounded-full" />
        <Skeleton className=" w-[100px] h-2 rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonFollowCard;
