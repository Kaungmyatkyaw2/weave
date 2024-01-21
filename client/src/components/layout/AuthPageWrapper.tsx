import React from "react";
import styles from "./css/styles.module.css";

export const AuthPageWrapper = ({
  children,
  bg,
  ...props
}: { bg?: string } & React.HTMLProps<HTMLDivElement>) => {
  return (
    <div className={`flex items-center h-screen bg-white`}>
      <div
        className={`lg:w-[55%] w-[50%] h-screen sm:block hidden ${
          props.className
        } ${styles[bg ? "bg" + bg : "bgLogin"]} ${styles.bg}`}
      ></div>
      <div className="lg:w-[45%] sm:w-[50%] w-full h-screen px-[20px] flex items-center justify-center text-black">
        {children}
      </div>
    </div>
  );
};
