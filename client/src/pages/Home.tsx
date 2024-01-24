import {
  CreateUpdatePostDialog,
  PostCard,
  SkeletonPostCard,
} from "../components/post";
import { Post } from "../types/post.types";
import { useGetPosts } from "../hooks/query/post.hooks";
import { splitPagesData } from "../lib/infiniteScroll";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { Button } from "../components/ui/button";
import { Loader, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import NoDataPlaceHolder from "../shared/others/NoDataPlaceHolder";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setOffsetY } from "@/store/slice/theme.slice";

export const Home = () => {
  const query = useGetPosts();
  const Posts = splitPagesData<Post>(query.data);

  const offsetY = useSelector((state: RootState) => state.theme.offsetY);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useInfiniteScroll(query);

  useEffect(() => {
    if (offsetY) {
      window.scrollTo(0, offsetY);
    }

    dispatch(setOffsetY(undefined));
  }, []);

  return (
    <div className="w-full relative space-y-[15px]">
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
            <NoDataPlaceHolder className="h-[80vh]" iconSize={100}>
              No Posts Yet
            </NoDataPlaceHolder>
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

      <CreateUpdatePostDialog onOpenChange={setOpen} open={open} />

      <Button
        onClick={() => setOpen(true)}
        className="rounded-full h-[50px] w-[50px] fixed bottom-[30px] md:right-[30px] right-[5px] z-[9] text-[white]"
      >
        <Plus />
      </Button>
    </div>
  );
};
