import { Newspaper, UserCircle, LogOut, Search } from "lucide-react";
import { NavLink, NavLinkProps, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeToken } from "@/store/slice/auth.slice";
import { removeCurrentUser } from "@/store/slice/user.slice";
import { RootState } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";
import UserAvatar from "../user/UserAvatar";
import { useState } from "react";
import SearchDialog from "./SearchDialog";

interface SideBtnProps extends NavLinkProps {
  icon: any;
  children: React.ReactNode;
}

const SideBtn = ({ className, children, ...props }: SideBtnProps) => {
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        `flex sm:space-x-[10px] transition-all duration-200  ${className} ${
          isActive
            ? "text-icon sm:border-b-0 border-b-2 border-icon sm:pb-0 pb-[5px]"
            : "text-black"
        }`
      }
    >
      <props.icon className="sm:h-5 sm:w-5" />
      <span className="text-sm sm:inline hidden">{children}</span>
    </NavLink>
  );
};

const ProfileBtn = ({ className, children, ...props }: SideBtnProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  return (
    <NavLink
      {...props}
      className={`flex sm:space-x-[10px] transition-all duration-200  ${className} ${
        location.pathname == `/user/${currentUser?._id}`
          ? "text-icon sm:border-b-0 border-b-2 border-icon sm:pb-0 pb-[5px]"
          : "text-black"
      }`}
    >
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
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <SearchDialog open={openSearch} onOpenChange={setOpenSearch} />
      <SideBtn icon={Newspaper} to={"/"}>
        New feed
      </SideBtn>
      <ProfileBtn to={`/user/${userId}`} icon={UserCircle}>
        Profile
      </ProfileBtn>
      <button
        onClick={() => {
          setOpenSearch(true);
        }}
        className={` lg:hidden flex sm:space-x-[10px] transition-all duration-200 text-black`}
      >
        <Search className="sm:h-5 sm:w-5" />
        <span className="text-sm sm:inline hidden">Search</span>
      </button>
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
          <UserAvatar user={currentUser} />
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
