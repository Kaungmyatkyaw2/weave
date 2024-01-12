import { PostCard, SkeletonPostCard } from "@/components/post";
import { ProfileCard, ProfileSkeletonCard } from "@/components/user";
import { useGetPostsByUser } from "@/hooks/query/post.hooks";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useGetUser } from "@/hooks/query/user.hooks";
import { splitPagesData } from "@/lib/infiniteScroll";
import { Post } from "@/types/post.types";
import { User } from "@/types/user.type";
import { useParams } from "react-router-dom";

export const UserPage = () => {
  const { id } = useParams();

  const userQuery = useGetUser(id);
  const postQuery = useGetPostsByUser(id);
  useInfiniteScroll(postQuery);

  const user: User = userQuery.data?.data?.data;
  const Posts = splitPagesData<Post>(postQuery.data);

  return (
    <div className="w-full space-y-[30px]">
      {userQuery.isLoading ? (
        <ProfileSkeletonCard />
      ) : (
        <ProfileCard user={user} />
      )}

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
    </div>
  );
};
