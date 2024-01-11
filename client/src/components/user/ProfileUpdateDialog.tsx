import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUpdateMe } from "@/hooks/user.hooks";
import { MyInput } from "@/shared/form";
import LoadingButton from "@/shared/others/LoadingButton";
import { RootState } from "@/store/store";
import { setRequired } from "@/validation";
import { DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import useErrorToast from "@/hooks/useErrorToast";

interface FormValues {
  userName: string;
  displayName: string;
}

export default function ProfileUpdateDialog({
  onOpenChange,
  ...props
}: DialogProps) {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const updateMeMutation = useUpdateMe();

  const form = useForm<FormValues>({
    defaultValues: {
      displayName: currentUser?.displayName,
      userName: currentUser?.userName,
    },
  });
  const { formState, handleSubmit, register } = form;
  const { isValid, isDirty, errors } = formState;

  const errToast = useErrorToast();

  const onSubmit = (values: FormValues) => {
    updateMeMutation.mutateAsync(values, {
      onSuccess() {
        onOpenChange?.(false);
      },
      onError(error: any) {
        errToast(error, `Failed to update your info`);
      },
    });
  };

  return (
    <Dialog
      {...props}
      onOpenChange={updateMeMutation.isLoading ? undefined : onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <MyInput
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
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <MyInput
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
            className="text-sm py-[15px] px-[20px] w-fit"
          >
            Save changes
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
