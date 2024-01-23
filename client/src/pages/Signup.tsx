import { AuthPageWrapper } from "@/components/layout";
import { UserInfoBox, UserPasswordBox } from "@/components/signup";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import UserAvatar from "@/components/user/UserAvatar";
import useErrorToast from "@/hooks/useErrorToast";
import axiosClient from "@/lib/axios";
import LoadingButton from "@/shared/others/LoadingButton";
import { ChevronLeft } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import userAvatar from "@/assets/user-avatar.png";

export interface FormValues {
  email: string;
  displayName: string;
  userName: string;
  password: string;
  passwordConfirm: string;
  bio: string;
}

type FormKeys = keyof FormValues;

const steps = [
  ["email", "userName", "displayName"],
  ["password", "passwordConfirm"],
];

export const Signup = () => {
  const [stepNum, setStepNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [previewImg, setPreviewImg] = useState<string | undefined>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const { register, formState, trigger, handleSubmit } = useForm<FormValues>();
  const { errors } = formState;

  const { toast } = useToast();

  const errToast = useErrorToast();

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();

      type Keys = keyof FormValues;

      steps[0].forEach((el: string) => {
        formData.append(el, values[el as Keys]);
      });

      steps[1].forEach((el: string) => {
        formData.append(el, values[el as Keys]);
      });

      if (file) {
        formData.append("profilePicture", file);
      }

      setIsLoading(true);
      await axiosClient().post("users/signup", formData);
      setIsLoading(false);
      toast({
        title: "Register success 🎉🎉",
        description: "We have sent the verification link to your email!",
      });
    } catch (error: any) {
      errToast(error, "Failed to register account.");
      setIsLoading(false);
    }
  };

  const next = async () => {
    const output = await trigger(steps[stepNum] as FormKeys[]);
    if (!output) return;

    if (stepNum < 2) {
      setStepNum((pre) => pre + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const prev = () => {
    if (!stepNum) return;
    setStepNum((pre) => pre - 1);
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
    <AuthPageWrapper bg="Signup">
      <div className=" w-[400px]">
        <h1 className="text-3xl font-bold">Sign up to Weave</h1>
        <div className="py-[15px] text-sm text-gray-500 flex items-center space-x-[5px]">
          <button onClick={prev} disabled={isLoading}>
            <ChevronLeft />
          </button>
          <span> Step {stepNum + 1} of 3</span>
        </div>
        <form noValidate className="space-y-[20px]">
          {stepNum == 0 ? (
            <UserInfoBox errors={errors} register={register} />
          ) : stepNum == 1 ? (
            <div className="flex flex-col items-center space-y-[25px] py-[20px]">
              <h1 className="font-bold">Upload Profile Picture</h1>
              <UserAvatar
                onClick={() => {
                  fileRef?.current?.click();
                }}
                img={previewImg || userAvatar}
                className="h-[150px] w-[150px]"
              />
              <Input
                onChange={onFileChange}
                ref={fileRef}
                className="hidden"
                type="file"
              />
            </div>
          ) : (
            <UserPasswordBox errors={errors} register={register} />
          )}
          <LoadingButton loading={isLoading} type="button" onClick={next}>
            {!(stepNum == 2) ? "Next" : "Sign up"}
          </LoadingButton>
        </form>
      </div>
    </AuthPageWrapper>
  );
};
