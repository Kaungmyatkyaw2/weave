import { PostCard, SkeletonPostCard } from "@/components/post";
import FollowCard from "@/components/user/FollowCard";
import SkeletonFollowCard from "@/components/user/SkeletonFollowCard";
import { updateQuerySearchUsers } from "@/hooks/query/helper";
import { useSearchPosts } from "@/hooks/query/post.hooks";
import { useSearchUsers } from "@/hooks/query/user.hooks";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { splitPagesData } from "@/lib/infiniteScroll";
import LoadingButton from "@/shared/others/LoadingButton";
import { Post } from "@/types/post.types";
import { Follow, User } from "@/types/user.type";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export const Search = () => {
  const [searchParams] = useSearchParams();

  const context = searchParams.get("context");

  const userQuery = useSearchUsers(context || "");
  const postQuery = useSearchPosts(context || "");

  const queryClient = useQueryClient();

  const Users = splitPagesData<User>(userQuery.data);
  const Posts = splitPagesData<Post>(postQuery.data);

  useInfiniteScroll(postQuery);

  const fetchMoreUsers = () => {
    if (userQuery.hasNextPage) {
      userQuery.fetchNextPage();
    }
  };

  const onFollowSuccess = (follow: Follow) => {
    updateQuerySearchUsers(
      queryClient,
      follow.followingUser._id,
      context as string,
      follow._id
    );
  };

  const onUnFollowSuccess = (followUserId: string) => {
    updateQuerySearchUsers(queryClient, followUserId, context as string);
  };

  return (
    <div className="w-full space-y-[20px]">
      <h1 className="font-bold py-[10px] text-lg">
        Result for "{searchParams.get("context")}"
      </h1>
      <div className="border space-y-[10px] px-[10px] py-[10px]">
        {userQuery.isLoading ? (
          <>
            <SkeletonFollowCard />
            <SkeletonFollowCard />
            <SkeletonFollowCard />
          </>
        ) : Users?.length ? (
          Users?.map((user) => (
            <FollowCard
              key={user._id}
              onFollowSuccess={onFollowSuccess}
              onUnFollowSuccess={onUnFollowSuccess}
              followId={user.followId}
              isAlreadyFollow={!!user.followId}
              user={user}
            />
          ))
        ) : (
          <h1 className="font-bold text-center text-lg">No Users Found</h1>
        )}
        {userQuery.hasNextPage ? (
          <LoadingButton
            loading={userQuery.isFetchingNextPage}
            onClick={fetchMoreUsers}
            className="px-[10px] py-[10px] text-[14px] bg-white hover:bg-white text-blue-600"
          >
            See more
          </LoadingButton>
        ) : (
          <></>
        )}
      </div>

      {postQuery.isLoading ? (
        <>
          <SkeletonPostCard />
          <SkeletonPostCard />
        </>
      ) : (
        <>
          {Posts?.map((el: Post) => (
            <PostCard post={el} key={el._id} />
          ))}
        </>
      )}
      {postQuery.isFetchingNextPage ? (
        <div className="w-full flex items-center justify-center py-[10px]">
          <Loader size={20} className="animate-spin" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
