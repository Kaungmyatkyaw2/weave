import icon from "@/assets/weave.png";

export const Navbar = () => {
  return (
    <nav className="lg:w-[80%] sm:w-[65%] w-full fixed top-0 right-0 h-[50px] flex items-center justify-center border-b bg-white/30 z-[9] backdrop-blur-sm">
      <button className="w-fit flex items-center space-x-[10px]">
        <img src={icon} width={40} alt="icon" />
        <p className="text-lg text-smoke font-bold">Weave</p>
      </button>
    </nav>
  );
};
