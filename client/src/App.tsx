import { PostCard } from "./components/post";
import { Post } from "./types/post.types";
import { useGetContacts } from "./hooks/post.hooks";
import { splitPagesData } from "./lib/infiniteScroll";
import useInfiniteScroll from "./hooks/useInfiniteScroll";
const App = () => {
  const query = useGetContacts();
  const Posts = splitPagesData<Post>(query.data);

  useInfiniteScroll(query);

  return (
    <div className="w-full space-y-[10px]">
      {!query.isLoading && (
        <>
          {Posts?.map((el: Post) => (
            <PostCard post={el} key={el._id} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
