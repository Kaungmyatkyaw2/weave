import { FormValues } from "@/pages";
import { LabeledInput } from "@/shared/form/LabeledInput";
import { passwordLength, setRequired } from "@/validation";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const UserPasswordBox = ({ register, errors }: Props) => {
  return (
    <>
      <LabeledInput
        required
        label="Password"
        type="password"
        isError={errors.password}
        error={errors.password?.message}
        {...register("password", {
          required: setRequired("Password is required"),
          minLength: passwordLength,
        })}
      />
      <LabeledInput
        required
        label="Confirm Password"
        type="password"
        isError={errors.passwordConfirm}
        error={errors.passwordConfirm?.message}
        {...register("passwordConfirm", {
          required: setRequired("Confirm password is required"),
          minLength: passwordLength,
        })}
      />
    </>
  );
};
