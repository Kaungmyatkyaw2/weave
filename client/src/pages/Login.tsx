import { useForm } from "react-hook-form";
import { emailPattern, setRequired } from "@/validation";
import axiosClient from "@/lib/axios";
import LoadingButton from "@/shared/others/LoadingButton";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LabeledInput } from "@/shared/form/LabeledInput";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthPageWrapper } from "@/components/layout";
import { useDispatch } from "react-redux";
import { login } from "@/store/slice/auth.slice";

interface FormValues {
  email: string;
  password: string;
}

export const Login = () => {
  const { toast } = useToast();
  const form = useForm<FormValues>();
  const { register, handleSubmit, formState } = form;
  const { errors, isValid, isDirty } = formState;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const res = await axiosClient().post("users/login", values);
      dispatch(login(res.data.token));
      navigate("/");
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "Failed to login.",
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
            isError={errors.email}
            error={errors.email?.message}
            {...register("email", {
              required: setRequired("Email is required"),
              pattern: emailPattern,
            })}
            label="Email"
          />
          <div className="w-full h-fit relative">
            <LabeledInput
              label="Password"
              required
              isError={errors.password}
              error={errors.password?.message}
              {...register("password", {
                required: setRequired("Password is required"),
              })}
            />
            <NavLink
              to={"/forgotPassword"}
              className={"absolute top-0 right-0 text-sm underline"}
            >
              Forgot?
            </NavLink>
          </div>
          <LoadingButton loading={isLoading} disabled={isDirty && !isValid}>
            Sign in
          </LoadingButton>
          <p className="text-smoke text-sm text-center">
            Don't have an account?{" "}
            <NavLink to={"/signup"} className={"text-black underline"}>
              Sign up
            </NavLink>
          </p>
        </form>
      </div>
    </AuthPageWrapper>
  );
};
