import React from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Navigate } from "react-router-dom";

export const LayoutProvider = ({
  children,
}: React.HTMLProps<HTMLDivElement>) => {
  const { access_token } = useSelector((state: RootState) => state.auth);

  if (!access_token) {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <section>
      <Sidebar />
      <Navbar />
      <div className="lg:w-[80%] sm:w-[65%] w-full lg:ml-[20%] sm:ml-[35%] ml-0 mt-[50px] flex items-center justify-center">
        <div className="lg:w-[60%] sm:w-[80%] w-full pt-[30px] sm:pb-[30px] pb-[80px] flex justify-center">{children}</div>
      </div>
    </section>
  );
};
