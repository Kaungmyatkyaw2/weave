import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from "@/store/store";
import { LucideIcon, MoreHorizontalIcon } from "lucide-react";
import { useSelector } from "react-redux";

interface Action {
  icon: LucideIcon;
  text: string;
  onClick?: any;
}

export default function MoreOptions({ actions }: { actions: Action[] }) {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontalIcon size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`${isDarkMode ? "dark " : ""}  bg-white text-black`}
      >
        {actions.map((ac, index) => (
          <DropdownMenuItem
            key={index}
            onClick={ac.onClick}
            className="cursor-pointer space-x-[10px] flex items-center py-[8px]"
          >
            <ac.icon size={15} />
            <span>{ac.text}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
