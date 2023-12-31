import { Dialog, DialogContent } from "../ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Avatar, AvatarFallback } from "../ui/avatar";
import LoadingButton from "@/shared/others/LoadingButton";
import { useCreatePost, useUpdatePost } from "@/hooks/post.hooks";
import { Post } from "@/types/post.types";
import SharedPostPreviewCard from "./SharedPostPreviewCard";

interface Prop extends DialogProps {
  isUpdateDialog?: boolean;
  toUpdateSharedPost?: Post;
  toShare: Post;
}

export const CreateUpdateSharePostDialog = ({
  onOpenChange,
  isUpdateDialog,
  toUpdateSharedPost,
  toShare,
  ...props
}: Prop) => {
  const [title, setTitle] = useState<string | undefined>("");
  const user = useSelector((state: RootState) => state.user.currentUser);
  const currentUser = isUpdateDialog ? toUpdateSharedPost?.user : user;

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  useEffect(() => {
    if (isUpdateDialog) {
      setTitle(toUpdateSharedPost?.title);
    }
  }, [isUpdateDialog, toUpdateSharedPost]);

  const onCloseDialog = () => {
    setTitle(isUpdateDialog ? toUpdateSharedPost?.title : "");
  };

  const onCreateOrUpdate = () => {
    const formData = new FormData();

    formData.append("title", title || "");

    if (!isUpdateDialog) {
      formData.append("sharedPost", toShare._id);
    }

    const mutation = isUpdateDialog ? updateMutation : createMutation;
    const payload = isUpdateDialog
      ? { id: toUpdateSharedPost?._id, values: formData }
      : formData;

    mutation.mutateAsync(payload, {
      onError(error) {
        console.log(error);
      },
      onSuccess() {
        onCloseDialog();
        onOpenChange?.(false);
      },
    });
  };

  const handleTextareaResize = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  return (
    <Dialog
      onOpenChange={
        createMutation.isLoading || updateMutation.isLoading
          ? () => {}
          : () => {
              onCloseDialog();
              onOpenChange?.(!open);
            }
      }
      {...props}
    >
      <DialogContent className="sm:min-w-[50%] min-w-full px-0">
        <div className="sm:h-[80vh] h-[90vh] w-full px-[30px]">
          <div className="w-full h-[20%] flex items-center">
            <Avatar className=" w-[50px] h-[50px]">
              <AvatarFallback className="bg-green-500">
                {currentUser?.displayName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="pl-[10px]">
              <div className="space-y-[3px]">
                <h1 className="text-md font-bold">
                  {currentUser?.displayName}
                </h1>
                <p className="text-sm text-smoke">@{currentUser?.userName}</p>
              </div>
            </div>
          </div>
          <div className="w-full h-[65%] overflow-y-scroll styled-scroll py-[10px]">
            <textarea
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              onInput={handleTextareaResize}
              placeholder="Title...."
              className="outline-none text-sm placeholder:text-lg resize-none w-full"
            />

            <SharedPostPreviewCard post={toShare} />
          </div>

          <div className="w-full h-[15%] flex items-center justify-end">
            <LoadingButton
              loading={createMutation.isLoading || updateMutation.isLoading}
              onClick={onCreateOrUpdate}
              className="py-[25px] px-[20px] w-fit text-[14px] rounded-full"
            >
              Share
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
