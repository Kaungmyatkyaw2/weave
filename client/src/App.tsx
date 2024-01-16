import {
  CreateUpdatePostDialog,
  PostCard,
  SkeletonPostCard,
} from "./components/post";
import { Post } from "./types/post.types";
import { useGetPosts } from "./hooks/query/post.hooks";
import { splitPagesData } from "./lib/infiniteScroll";
import useInfiniteScroll from "./hooks/useInfiniteScroll";
import { Button } from "./components/ui/button";
import { Loader, Plus, Radar } from "lucide-react";
import { useState } from "react";

const App = () => {
  const query = useGetPosts();
  const Posts = splitPagesData<Post>(query.data);

  const [open, setOpen] = useState(false);

  useInfiniteScroll(query);

  return (
    <div className="w-full space-y-[10px] relative">
      <Button
        onClick={() => setOpen(true)}
        className="rounded-full h-[50px] w-[50px] fixed bottom-[30px] md:right-[30px] right-[5px] z-[9]"
      >
        <Plus />
      </Button>
      <CreateUpdatePostDialog onOpenChange={setOpen} open={open} />

      {query.isLoading ? (
        <>
          <SkeletonPostCard />
          <SkeletonPostCard />
        </>
      ) : (
        <>
          {Posts?.length ? (
            Posts?.map((el: Post) => <PostCard post={el} key={el._id} />)
          ) : (
            <div className="w-full h-full space-y-2 flex flex-col items-center justify-center text-gray-500">
              <Radar size={100} />
              <h1>No Posts Yet</h1>
            </div>
          )}
        </>
      )}
      {query.isFetchingNextPage ? (
        <div className="w-full flex items-center justify-center py-[10px]">
          <Loader size={20} className="animate-spin" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;
