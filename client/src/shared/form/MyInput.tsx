import { Input, InputProps } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { forwardRef, useState } from "react";

interface MyInputProps extends InputProps {
  isError?: {} | boolean;
  error?: string | undefined;
}

export const MyInput = forwardRef(
  (
    { required, id, isError, error, ...props }: MyInputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const [type, setType] = useState(props.type);

    return (
      <div>
        {isError && (
          <span className="text-red-700 text-[13px] pl-[5px]">{error}</span>
        )}
        <div className="w-full h-fit relative">
          <Input
            ref={ref}
            required={required}
            id={id}
            className={`border-gray-400 py-[24px] px-[15px] focus:border-blue-500 ${props.className}`}
            placeholder={props.placeholder}
            {...props}
            type={type}
          />
          {required && (
            <span className="text-red-500 pl-[10px] text-[15px] absolute top-[2px] left-[0px]">
              *
            </span>
          )}
          {props.type === "password" ? (
            <span className="absolute right-[10px] top-[50%] translate-y-[-50%] cursor-pointer">
              {type == "text" ? (
                <EyeIcon
                  onClick={() => {
                    setType("password");
                  }}
                />
              ) : (
                <EyeOffIcon
                  onClick={() => {
                    setType("text");
                  }}
                />
              )}
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
);
