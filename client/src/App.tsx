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
import { Loader, Plus } from "lucide-react";
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
          {Posts?.map((el: Post) => (
            <PostCard post={el} key={el._id} />
          ))}
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
