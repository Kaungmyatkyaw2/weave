import { Dialog, DialogContent } from "../ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Avatar, AvatarFallback } from "../ui/avatar";
import LoadingButton from "@/shared/others/LoadingButton";
import { useCreatePost, useUpdatePost } from "@/hooks/post.hooks";
import { Input } from "../ui/input";
import { Post } from "@/types/post.types";
import { Image } from "lucide-react";
import ImageVideoPlayer from "./ImageVideoPlayer";

interface Prop extends DialogProps {
  isUpdateDialog?: boolean;
  orgPost?: Post;
}

export const CreateUpdatePostDialog = ({
  onOpenChange,
  isUpdateDialog,
  orgPost,
  ...props
}: Prop) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const currentUser = isUpdateDialog ? orgPost?.user : user;
  const [title, setTitle] = useState<string | undefined>("");
  const [previewImg, setPreviewImg] = useState<string | undefined>("");
  const [isImage, setIsImage] = useState<boolean>();
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  useEffect(() => {
    if (isUpdateDialog) {
      setPreviewImg(orgPost?.image);
      setIsImage(orgPost?.image?.includes("image"));
      setTitle(orgPost?.title);
    }
  }, [isUpdateDialog, orgPost]);

  const onCloseDialog = () => {
    setTitle(isUpdateDialog ? orgPost?.title : "");
    setFile(null);
    setPreviewImg(isUpdateDialog ? orgPost?.image : "");
    if (fileRef.current) {
      fileRef.current.files = null;
    }
  };

  const onCreateOrUpdate = () => {
    const formData = new FormData();

    formData.append("title", title || "");
    if (file) {
      formData.append("image", file);
    }

    const mutation = isUpdateDialog ? updateMutation : createMutation;
    const payload = isUpdateDialog
      ? { id: orgPost?._id, values: formData }
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

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setIsImage(files[0].type.startsWith("image"));
      setFile(files[0]);
      setPreviewImg(url);
    }
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
            {previewImg && (
              <ImageVideoPlayer src={previewImg} isVideo={!isImage} />
            )}
          </div>
          <div className="w-full h-[15%] flex items-center justify-between">
            <Image
              className="cursor-pointer"
              onClick={() => fileRef.current?.click()}
            />
            <Input
              ref={fileRef}
              onChange={onFileChange}
              id="picture"
              type="file"
              className="hidden"
            />
            <LoadingButton
              loading={createMutation.isLoading || updateMutation.isLoading}
              onClick={onCreateOrUpdate}
              className="py-[25px] px-[20px] w-fit text-[14px] rounded-full"
            >
              Submit
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
