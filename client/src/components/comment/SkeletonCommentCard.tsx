import { Skeleton } from "../ui/skeleton";

export const SkeletonCommentCard = () => {
  return (
    <div className="p-[10px] border rounded-[10px]">
      <div className="flex space-x-[10px]">
        <div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <div className="w-full space-y-[5px]">
          <div className="flex items-center text-sm space-x-2">
            <Skeleton className="w-[20%] h-4" />
            <Skeleton className="w-[15%] h-4" />
            <Skeleton className="w-[10%] h-4" />
          </div>
          <Skeleton className="w-[70%] h-10" />
        </div>
      </div>
    </div>
  );
};
