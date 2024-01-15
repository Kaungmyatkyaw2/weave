import { Skeleton } from "../ui/skeleton";

export const SkeletonPostCard = () => {
  return (
    <div className="w-full border px-[20px] py-[20px] rounded-md space-y-[20px]">
      <div className="w-full flex space-x-[10px]">
        <div className="w-[60px]">
          <Skeleton className="h-[50px] w-[50px] rounded-full" />
        </div>

        <div className="py-[1px] w-[calc(100%-60px)]">
          <div className="flex space-x-[10px] items-center">
            <Skeleton className="h-4 w-[50%] " />
            <Skeleton className="h-4 w-[20%] " />
          </div>
          <div className="text-[13px] text-smoke pb-[10px] pt-[5px]">
            <Skeleton className="h-2 w-12 " />
          </div>
          <Skeleton className="h-[100px] w-[70%] " />
        </div>
      </div>
    </div>
  );
};
