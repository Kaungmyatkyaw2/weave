import { PostCard } from "./components/post";
import { Post } from "./types/post.types";
import { useCreatePost, useGetPosts } from "./hooks/post.hooks";
import { splitPagesData } from "./lib/infiniteScroll";
import useInfiniteScroll from "./hooks/useInfiniteScroll";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogFooter } from "./components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Label } from "@radix-ui/react-label";
import { Input } from "./components/ui/input";
import LoadingButton from "./shared/others/LoadingButton";

interface Prop extends DialogProps {}

const CreateDialog = ({ onOpenChange, ...props }: Prop) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [title, setTitle] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const mutation = useCreatePost();

  const onCreate = async () => {
    const formData = new FormData();
    const files = fileRef.current?.files;

    formData.append("title", title);
    if (files?.length) {
      formData.append("image", files[0]);
    }

    //@ts-ignore
    await mutation.mutateAsync(formData, {
      onError(error) {
        console.log(error);
      },
      onSuccess() {
        setTitle("");
        onOpenChange?.(false);
      },
    });
  };

  return (
    <Dialog
      onOpenChange={mutation.isLoading ? () => {} : onOpenChange}
      {...props}
    >
      <DialogContent className="">
        <div className="w-full flex items-center">
          <Avatar className=" w-[50px] h-[50px]">
            <AvatarFallback className="bg-green-500">
              {currentUser?.displayName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="pl-[10px]">
            <div className="space-y-[3px]">
              <h1 className="text-md font-bold">{currentUser?.displayName}</h1>
              <p className="text-sm text-smoke">@{currentUser?.userName}</p>
            </div>
          </div>
        </div>
        <textarea
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title...."
          className="outline-none text-sm placeholder:text-lg h-[50px] styled-scroll"
        />
        <div className="w-full">
          <Label htmlFor="picture" className="text-sm">
            Picture
          </Label>
          <Input
            ref={fileRef}
            id="picture"
            type="file"
            accept="image/*"
            className="text-sm cursor-pointer w-full"
          />
        </div>
        <DialogFooter>
          <LoadingButton
            loading={mutation.isLoading}
            onClick={onCreate}
            className="py-[25px]"
          >
            Submit
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
      <CreateDialog onOpenChange={setOpen} open={open} />
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
