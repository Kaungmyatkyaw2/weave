import { BotIcon } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="lg:w-[80%] sm:w-[65%] w-full fixed top-0 right-0 h-[50px] flex items-center justify-center border-b bg-white z-[9]">
      <button className="w-fit flex items-center space-x-[10px]">
        <BotIcon size={30} className="text-red-600" />
        <p className="text-sm text-smoke">Weave</p>
      </button>
    </nav>
  );
};
