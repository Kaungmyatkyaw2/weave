import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUpdateMe } from "@/hooks/query/user.hooks";
import { MyInput } from "@/shared/form";
import LoadingButton from "@/shared/others/LoadingButton";
import { RootState } from "@/store/store";
import { setRequired } from "@/validation";
import { DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import useErrorToast from "@/hooks/useErrorToast";
import UserAvatar from "./UserAvatar";
import { Input } from "../ui/input";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface FormValues {
  userName: string;
  displayName: string;
  bio: string;
}

export default function ProfileUpdateDialog({
  onOpenChange,
  ...props
}: DialogProps) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const [file, setFile] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | undefined>("");

  const updateMeMutation = useUpdateMe();

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewImg(currentUser?.profilePicture);
  }, [currentUser]);

  const form = useForm<FormValues>({
    defaultValues: {
      displayName: currentUser?.displayName,
      userName: currentUser?.userName,
      bio: currentUser?.bio,
    },
  });
  const { formState, handleSubmit, register } = form;
  const { isValid, isDirty, errors } = formState;

  const errToast = useErrorToast();

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();

    formData.append("userName", values.userName);
    formData.append("displayName", values.displayName);
    formData.append("bio", values.bio);
    if (file) {
      formData.append("profilePicture", file);
    }

    updateMeMutation.mutateAsync(formData, {
      onSuccess() {
        onOpenChange?.(false);
      },
      onError(error: any) {
        errToast(error, `Failed to update your info`);
      },
    });
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setFile(files[0]);
      setPreviewImg(url);
    }
  };

  return (
    <Dialog
      {...props}
      onOpenChange={updateMeMutation.isLoading ? undefined : onOpenChange}
    >
      <DialogContent
        className={`${
          isDarkMode ? "dark " : ""
        } sm:max-w-[425px] text-black bg-white`}
      >
        <DialogHeader>
          <DialogTitle>Edit Your profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <div className="w-full flex items-center justify-center">
            <UserAvatar
              img={previewImg}
              onClick={() => {
                fileRef.current?.click();
              }}
              user={currentUser}
              className="h-[100px] w-[100px]"
            />
            <Input
              onChange={onFileChange}
              className="hidden"
              ref={fileRef}
              type="file"
              accept="*/img"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <MyInput
              placeholder="Name..."
              className="py-[20px]"
              parentClassName="col-span-3"
              isError={errors.displayName}
              error={errors.displayName?.message}
              {...register("displayName", {
                required: setRequired("Name is required"),
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <MyInput
              placeholder="Bio..."
              className="py-[20px]"
              parentClassName="col-span-3"
              isError={errors.bio}
              error={errors.bio?.message}
              {...register("bio")}
            />{" "}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <MyInput
              placeholder="Username..."
              className="py-[20px]"
              parentClassName="col-span-3"
              isError={errors.userName}
              error={errors.userName?.message}
              {...register("userName", {
                required: setRequired("Name is required"),
              })}
            />{" "}
          </div>
        </form>
        <DialogFooter>
          <LoadingButton
            onClick={handleSubmit(onSubmit)}
            disabled={isDirty && !isValid}
            loading={updateMeMutation.isLoading}
            type="submit"
            className="text-[15px] py-[15px] px-[20px] w-fit"
          >
            Save changes
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
