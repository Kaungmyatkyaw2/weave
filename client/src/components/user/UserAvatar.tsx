import { User } from "@/types/user.type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { AvatarProps } from "@radix-ui/react-avatar";

interface Props extends AvatarProps {
  user?: User | null;
  img?: string;
}

const UserAvatar = ({ user, className, img, onClick, ...props }: Props) => {
  const navigate = useNavigate();
  return (
    <Avatar
      {...props}
      className={`cursor-pointer ${className}`}
      onClick={
        onClick
          ? onClick
          : (e) => {
            e.stopPropagation()
            navigate(`/user/${user?._id}`);
          }
      }
    >
      <AvatarImage className="object-cover object-left-top" src={img || user?.profilePicture} alt="@shadcn" />

      <AvatarFallback className="bg-green-500">
        {user?.displayName.substring(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
