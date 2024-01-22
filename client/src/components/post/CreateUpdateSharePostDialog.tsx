import { Dialog, DialogContent } from "../ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LoadingButton from "@/shared/others/LoadingButton";
import { useCreatePost, useUpdatePost } from "@/hooks/query/post.hooks";
import { Post } from "@/types/post.types";
import SharedPostPreviewCard from "./SharedPostPreviewCard";
import useErrorToast from "@/hooks/useErrorToast";
import UserAvatar from "../user/UserAvatar";
import TextareaAutosize from "react-textarea-autosize";
import PrivacySelectBox from "./PrivacySelectBox";

interface Prop extends DialogProps {
  isUpdateDialog?: boolean;
  orgPost?: Post;
  toShare: Post;
}

export const CreateUpdateSharePostDialog = ({
  onOpenChange,
  isUpdateDialog,
  orgPost,
  toShare,
  open,
  ...props
}: Prop) => {
  const [title, setTitle] = useState<string | undefined>("");
  const user = useSelector((state: RootState) => state.user.currentUser);
  const currentUser = isUpdateDialog ? orgPost?.user : user;
  const [privacy, setPrivacy] = useState(
    isUpdateDialog ? orgPost?.privacy || "" : "PUBLIC"
  );

  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const errToast = useErrorToast();

  useEffect(() => {
    if (isUpdateDialog) {
      setPrivacy(orgPost?.privacy || "PUBLIC");
      setTitle(orgPost?.title);
    }
  }, [isUpdateDialog, orgPost, open]);

  const onCloseDialog = () => {
    setTitle(isUpdateDialog ? orgPost?.title : "");
  };

  const onCreateOrUpdate = () => {
    const formData = new FormData();

    formData.append("title", title || "");
    formData.append("privacy", privacy.toUpperCase());

    if (!isUpdateDialog) {
      formData.append("sharedPost", toShare._id);
    }

    const mutation = isUpdateDialog ? updateMutation : createMutation;
    const payload = isUpdateDialog
      ? { id: orgPost?._id, values: formData }
      : formData;

    mutation.mutateAsync(payload, {
      onError(error: any) {
        errToast(error, `Failed to ${isUpdateDialog ? "Update" : "Create"}`);
      },
      onSuccess() {
        onCloseDialog();
        onOpenChange?.(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
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
      <DialogContent
        className={`${
          isDarkMode ? "dark " : ""
        } sm:min-w-[50%] min-w-full px-0 bg-white text-black`}
      >
        <div className="sm:h-[80vh] h-[90vh] w-full px-[30px]">
          <div className="w-full sm:h-[20%] flex sm:items-center">
            <UserAvatar className=" w-[50px] h-[50px]" user={currentUser} />
            <div className="pl-[10px] flex sm:flex-row flex-col items-center space-x-[10px] sm:space-y-0 space-y-2">
              <div className="space-y-[3px]">
                <h1 className="text-md font-bold text-black">
                  {currentUser?.displayName}
                </h1>
                <p className="text-sm text-smoke">@{currentUser?.userName}</p>
              </div>
              <PrivacySelectBox value={privacy} setValue={setPrivacy} />
            </div>
          </div>
          <div className="w-full h-[65%] overflow-y-scroll styled-scroll py-[10px] space-y-[10px]">
            <TextareaAutosize
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              placeholder="Title...."
              className="outline-none text-sm placeholder:text-lg resize-none w-full bg-white text-black overflow-y-hidden"
            />

            <SharedPostPreviewCard post={toShare} />
          </div>

          <div className="w-full h-[15%] flex items-center justify-end">
            <LoadingButton
              loading={createMutation.isLoading || updateMutation.isLoading}
              onClick={onCreateOrUpdate}
              className="py-[25px] px-[20px] w-fit text-[15px] rounded-full"
            >
              Share
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
