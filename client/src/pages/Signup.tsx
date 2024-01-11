import { AuthPageWrapper } from "@/components/layout";
import { UserInfoBox, UserPasswordBox } from "@/components/signup";
import { useToast } from "@/components/ui/use-toast";
import useErrorToast from "@/hooks/useErrorToast";
import axiosClient from "@/lib/axios";
import LoadingButton from "@/shared/others/LoadingButton";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export interface FormValues {
  email: string;
  displayName: string;
  userName: string;
  password: string;
  passwordConfirm: string;
}

type FormKeys = keyof FormValues;

const steps = [
  ["email", "userName", "displayName"],
  ["password", "passwordConfirm"],
];

export const Signup = () => {
  const [stepNum, setStepNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { register, formState, trigger, handleSubmit } = useForm<FormValues>();
  const { errors } = formState;

  const { toast } = useToast();

  const errToast = useErrorToast();

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      await axiosClient().post("users/signup", values);
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

    if (stepNum == 0) {
      setStepNum((pre) => pre + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const prev = () => {
    if (!stepNum) return;
    setStepNum((pre) => pre - 1);
  };

  return (
    <AuthPageWrapper bg="Signup">
      <div className=" w-[400px]">
        <h1 className="text-3xl font-bold">Sign up to Weave</h1>
        <div className="py-[15px] text-sm text-gray-500 flex items-center space-x-[5px]">
          <button onClick={prev} disabled={isLoading}>
            <ChevronLeft />
          </button>
          <span> Step {stepNum + 1} of 2</span>
        </div>
        <form noValidate className="space-y-[20px]">
          {!stepNum ? (
            <UserInfoBox errors={errors} register={register} />
          ) : (
            <UserPasswordBox errors={errors} register={register} />
          )}
          <LoadingButton loading={isLoading} type="button" onClick={next}>
            {!stepNum ? "Next" : "Sign up"}
          </LoadingButton>
        </form>
      </div>
    </AuthPageWrapper>
  );
};
