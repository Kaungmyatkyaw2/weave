import LoadingButton from "@/shared/others/LoadingButton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { emailPattern, setRequired } from "@/validation";
import axiosClient from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { NavLink } from "react-router-dom";
import { AuthPageWrapper } from "@/components/layout";
import { LabeledInput } from "@/shared/form/LabeledInput";

interface FormValues {
  email: string;
}

export const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>();
  const { formState, handleSubmit, register } = form;
  const { isValid, isDirty, errors } = formState;

  const { toast } = useToast();

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      await axiosClient().post("users/forgotPassword", values);
      toast({
        title: "Reset link is sent to your email.",
      });
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "Failed to reset your password.",
        description: error.response.data.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthPageWrapper>
      <div className=" w-[400px]">
        <h1 className="text-3xl font-bold">Forgot your password?</h1>
        <form
          noValidate
          className="space-y-[20px] pt-[20px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <LabeledInput
            required
            isError={errors.email}
            error={errors.email?.message}
            {...register("email", {
              required: setRequired("Email is required"),
              pattern: emailPattern,
            })}
            label="Email"
          />

          <LoadingButton loading={isLoading} disabled={isDirty && !isValid}>
            Send
          </LoadingButton>
          <p className="text-smoke text-sm text-center">
            Back to{" "}
            <NavLink to={"/login"} className={"text-black underline"}>
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </AuthPageWrapper>
  );
};
