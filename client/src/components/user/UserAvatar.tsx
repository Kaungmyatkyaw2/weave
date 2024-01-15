import { User } from "@/types/user.type";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { AvatarProps } from "@radix-ui/react-avatar";

interface Props extends AvatarProps {
  user?: User | null;
}

const UserAvatar = ({ user, className, ...props }: Props) => {
  const navigate = useNavigate();
  return (
    <Avatar
      {...props}
      className={`cursor-pointer ${className}`}
      onClick={() => {
        navigate(`/user/${user?._id}`);
      }}
    >
      <AvatarFallback className="bg-green-500">
        {user?.displayName.substring(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
