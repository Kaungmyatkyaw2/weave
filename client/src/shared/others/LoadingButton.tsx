import { Button, ButtonProps } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface Props extends ButtonProps {
  loading?: boolean;
}

const LoadingButton = ({ children, className, loading, ...props }: Props) => {
  return (
    <Button
      {...props}
      disabled={props.disabled || loading}
      className={`relative w-full text-[17px] py-[30px] disabled:opacity-30 disabled:cursor-not-allowed text-white dark:text-smoke ${className}`}
    >
      {loading && (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <Loader className="animate-spin" />
        </div>
      )}
      <span className={`${loading ? "opacity-0" : "opacity-1"}`}>
        {children}
      </span>
    </Button>
  );
};

export default LoadingButton;
