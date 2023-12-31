import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { ChangeEvent, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Label } from "@radix-ui/react-label";
import { RootState } from "@/store/store";
import { Avatar, AvatarFallback } from "../ui/avatar";
import LoadingButton from "@/shared/others/LoadingButton";
import { useCreatePost } from "@/hooks/post.hooks";
import { Input } from "../ui/input";

interface Prop extends DialogProps {
  isUpdateDialog?: boolean;
}

export const CreateUpdatePostDialog = ({ onOpenChange, ...props }: Prop) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [title, setTitle] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  const [isImage, setIsImage] = useState<boolean>();
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const mutation = useCreatePost();

  const onCloseDialog = () => {
    setTitle("");
    setFile(null);
    setPreviewImg("");
    if (fileRef.current) {
      fileRef.current.files = null;
    }
  };

  const onCreate = async () => {
    const formData = new FormData();

    formData.append("title", title);
    if (file) {
      formData.append("image", file);
    }

    //@ts-ignore
    await mutation.mutateAsync(formData, {
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
        mutation.isLoading
          ? () => {}
          : () => {
              onCloseDialog();
              onOpenChange?.(!open);
            }
      }
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
          onInput={handleTextareaResize}
          placeholder="Title...."
          className="outline-none text-sm placeholder:text-lg h-[50px] styled-scroll resize-none max-h-[170px] py-[10px]"
        />
        <div className="w-full space-y-[4px]">
          {previewImg &&
            (isImage ? (
              <img
                src={previewImg}
                className="w-full h-auto max-h-[200px] object-cover"
              />
            ) : (
              <video src={previewImg} height={200} width={300} controls />
            ))}
          <Label className="text-sm">Upload pic or video.</Label>
          <Input
            ref={fileRef}
            onChange={onFileChange}
            id="picture"
            type="file"
            // accept="image/*"
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
