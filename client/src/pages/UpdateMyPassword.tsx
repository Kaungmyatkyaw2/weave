import LoadingButton from "@/shared/others/LoadingButton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { passwordLength, setRequired } from "@/validation";
import axiosClient from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { LabeledInput } from "@/shared/form/LabeledInput";
import useErrorToast from "@/hooks/useErrorToast";
import { useDispatch } from "react-redux";
import { login } from "@/store/slice/auth.slice";

interface FormValues {
  oldPassword: string;
  password: string;
  passwordConfirm: string;
}

export const UpdateMyPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>();
  const { formState, handleSubmit, register } = form;
  const { isValid, isDirty, errors } = formState;

  const { toast } = useToast();
  const errToast = useErrorToast();

  const dispatch = useDispatch();

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const res = await axiosClient().patch(`users/updateMyPassword`, values);
      toast({
        title: "Succesfully update your password",
      });

      dispatch(login(res.data.token));
      form.reset();
      setIsLoading(false);
    } catch (error: any) {
      errToast(error, "Failed to update password.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full  pt-[20px]">
      <div className=" w-[500px]">
        <h1 className="text-3xl font-bold">Update Your Password</h1>
        <form
          noValidate
          className="space-y-[20px] pt-[20px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <LabeledInput
            required
            type="password"
            isError={errors.oldPassword}
            error={errors.oldPassword?.message}
            {...register("oldPassword", {
              required: setRequired("Old Password is required"),
              minLength: passwordLength,
            })}
            label="Old Password"
          />
          <LabeledInput
            required
            type="password"
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
            type="password"
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
        </form>
      </div>
    </div>
  );
};
