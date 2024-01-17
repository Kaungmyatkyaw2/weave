import { Radar } from "lucide-react";
import { HTMLProps } from "react";

const NoDataPlaceHolder = ({
  className,
  iconSize,
  ...props
}: HTMLProps<HTMLDivElement> & { iconSize: number }) => {
  return (
    <div
      className={`w-full h-full space-y-2 flex flex-col items-center justify-center text-gray-500 ${className}`}
    >
      <Radar size={iconSize || 100} />
      <h1>{props.children}</h1>
    </div>
  );
};

export default NoDataPlaceHolder;
