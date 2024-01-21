import icon from "@/assets/weave.png";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleMode } from "@/store/slice/theme.slice";

export const Navbar = () => {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  return (
    <nav className="lg:w-[80%] sm:w-[65%] w-full fixed top-0 right-0 h-[50px] flex items-center sm:justify-center justify-between border-b bg-white/30  z-[9] backdrop-blur-sm sm:px-0 px-[15px]">
      <button className="w-fit flex items-center space-x-[10px]">
        <img src={icon} width={40} alt="icon" />
        <p className="text-lg text-smoke font-bold">Weave</p>
      </button>
      <div className="sm:hidden flex items-center space-x-2">
        <Switch
          checked={isDarkMode}
          onCheckedChange={(e) => {
            dispatch(toggleMode(e.valueOf()));
          }}
          id="dark-mode"
        />
        <Label htmlFor="dark-mode">Dark Mode</Label>
      </div>
    </nav>
  );
};
