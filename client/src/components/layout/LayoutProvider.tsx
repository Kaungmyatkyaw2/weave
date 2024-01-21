import React from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Navigate } from "react-router-dom";
import RightSidebar from "./RightSidebar";

export const LayoutProvider = ({
  children,
}: React.HTMLProps<HTMLDivElement>) => {
  const { access_token } = useSelector((state: RootState) => state.auth);

  if (!access_token) {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <section className={`text-black bg-white`}>
      <Sidebar />
      <Navbar />
      <div className="lg:w-[50%] sm:w-[65%] w-full lg:ml-[20%] sm:ml-[35%] ml-0 pt-[50px] px-[20px] flex items-center justify-center">
        <div className="w-full pt-[10px] sm:pb-[30px] pb-[80px] flex justify-center min-h-screen">
          {children}
        </div>
      </div>
      <RightSidebar />
    </section>
  );
};
