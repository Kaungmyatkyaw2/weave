import LoadingButton from "@/shared/others/LoadingButton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { passwordLength, setRequired } from "@/validation";
import axiosClient from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";
import { AuthPageWrapper } from "@/components/layout";
import { LabeledInput } from "@/shared/form/LabeledInput";

interface FormValues {
  password: string;
  passwordConfirm: string;
}

export const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>();
  const { formState, handleSubmit, register } = form;
  const { isValid, isDirty, errors } = formState;

  const [searchParam] = useSearchParams();

  const { toast } = useToast();

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      await axiosClient().post(
        `users/resetPassword/${searchParam.get("token")}`,
        values
      );
      toast({
        title: "Succesfully update your password",
      });
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "Failed to sign up.",
        description: error.response.data.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthPageWrapper>
      <div className=" w-[400px]">
        <h1 className="text-3xl font-bold">Sign in to Weave</h1>
        <form
          noValidate
          className="space-y-[20px] pt-[20px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <LabeledInput
            required
            isError={errors.password}
            error={errors.password?.message}
            {...register("password", {
              required: setRequired("Password is required"),
              minLength: passwordLength,
            })}
            label="Password"
          />
          <LabeledInput
            required
            isError={errors.passwordConfirm}
            error={errors.passwordConfirm?.message}
            {...register("passwordConfirm", {
              required: setRequired("Confirm password is required"),
              minLength: passwordLength,
            })}
            label="Confirm password"
          />

          <LoadingButton loading={isLoading} disabled={isDirty && !isValid}>
            Reset
          </LoadingButton>
          {/* <p className="text-smoke text-sm text-center">
            Don't have an account?{" "}
            <NavLink to={"/signup"} className={"text-black underline"}>
              Sign up
            </NavLink>
          </p> */}
        </form>
      </div>
    </AuthPageWrapper>
  );
};
