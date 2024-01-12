import { User } from "@/types/user.type";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { NavLink, NavLinkProps } from "react-router-dom";

interface Props extends NavLinkProps {
  user: User;
}

const FollowCard = ({ user,...props }: Props) => {
  return (
    <NavLink
    {...props}
      to={`/user/${user._id}`}
      className="flex items-center space-x-[10px] cursor-pointer bg-gray-50 py-[10px] px-[10px] rounded-[10px]"
    >
      <Avatar className=" w-[60px] h-[60px] cursor-pointer">
        <AvatarFallback className="bg-green-500">
          {user?.displayName.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className=" w-full space-y-[5px]">
        <h1 className="font-bold">{user?.displayName}</h1>
        <p className="text-sm">@{user?.userName}</p>
      </div>
    </NavLink>
  );
};

export default FollowCard;
