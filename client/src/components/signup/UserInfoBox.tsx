import { FormValues } from "@/pages";
import { LabeledInput } from "@/shared/form/LabeledInput";
import { emailPattern, setRequired } from "@/validation";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const UserInfoBox = ({ register, errors }: Props) => {
  return (
    <>
      <LabeledInput
        required
        label="Email"
        isError={errors.email}
        error={errors.email?.message}
        {...register("email", {
          required: setRequired("Email is required"),
          pattern: emailPattern,
        })}
      />
      <LabeledInput
        required
        label="User name"
        isError={errors.userName}
        error={errors.userName?.message}
        {...register("userName", {
          required: setRequired("User name is required"),
        })}
      />
      <LabeledInput
        required
        label="Display name"
        isError={errors.displayName}
        error={errors.displayName?.message}
        {...register("displayName", {
          required: setRequired("Dispay name is required"),
        })}
      />
    </>
  );
};
