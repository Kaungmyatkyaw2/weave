import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Newspaper, UserCircle, Search, LogOut } from "lucide-react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeToken } from "@/store/slice/auth.slice";
import { removeCurrentUser } from "@/store/slice/user.slice";
import { RootState } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";

interface SideBtnProps extends NavLinkProps {
  icon: any;
  children: React.ReactNode;
}

const SideBtn = ({ className, children, ...props }: SideBtnProps) => {
  return (
    <NavLink {...props} className={`flex sm:space-x-[10px] ${className}`}>
      <props.icon className="sm:h-5 sm:w-5" />
      <span className="text-sm sm:inline hidden">{children}</span>
    </NavLink>
  );
};

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return (
    <button
      onClick={() => {
        dispatch(removeToken());
        dispatch(removeCurrentUser());
        queryClient.clear();
      }}
      className="sm:flex sm:space-x-[10px]"
    >
      <LogOut className={"sm:h-5 sm:w-5"} />
      <span className="sm:inline hidden text-sm">Log out</span>
    </button>
  );
};

const NavigationButtons = ({ userId }: { userId?: string }) => {
  return (
    <>
      <SideBtn icon={Newspaper} to={"/"}>
        New feed
      </SideBtn>
      <SideBtn to={"/"} icon={Search}>
        Search
      </SideBtn>
      <SideBtn to={`/user/${userId}`} icon={UserCircle}>
        Profile
      </SideBtn>
      <LogoutBtn />
    </>
  );
};

export const Sidebar = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <>
      <div className="lg:w-[20%] sm:w-[35%] h-screen sm:block hidden fixed top-0 left-0 py-[10px] border-r">
        <div className="py-[20px] px-[20px] space-y-[10px] border-b">
          <Avatar>
            <AvatarFallback className="bg-green-500">
              {currentUser?.displayName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center space-x-[10px]">
            <h1 className="font-bold text-lg">{currentUser?.displayName}</h1>
            <p className="font-medium text-sm text-smoke">
              @{currentUser?.userName}
            </p>
          </div>
          <div className="flex flex-wrap space-x-[20px]">
            <p className="text-sm">{currentUser?.follower} Followers</p>
            <p className="text-sm">{currentUser?.following} Following</p>
          </div>
        </div>
        <div className="py-[30px] px-[20px] space-y-[30px] border-b">
          <NavigationButtons userId={currentUser?._id} />
        </div>
      </div>

      <div className="w-full sm:hidden flex items-center justify-center fixed bottom-0 right-0 h-[50px]  border-t bg-white z-[9]">
        <div className="w-[80%] h-fit flex gap-16 items-center justify-center">
          <NavigationButtons userId={currentUser?._id} />
        </div>
      </div>
    </>
  );
};
