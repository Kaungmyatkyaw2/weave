import { InputProps } from "@/components/ui/input";
import { MyInput } from ".";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";

interface Props extends InputProps {
  label: string;
  isError?: {} | boolean;
  error?: string | undefined;
}

export const LabeledInput = forwardRef(
  ({ label, ...props }: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
    return (
      <div className="space-y-[5px]">
        <Label htmlFor={props.id} className="font-bold text-[16px]">
          {label}
        </Label>
        <MyInput {...props} ref={ref} />
      </div>
    );
  }
);
