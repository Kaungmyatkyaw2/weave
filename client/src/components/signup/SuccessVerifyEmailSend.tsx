import { NavLink } from "react-router-dom";

export const SuccessVerifyEmailSend = () => {
  return (
    <div className="sm:w-[80%] w-[100%] space-y-[15px]">
      <p className="text-sm">
        Back to
        <NavLink to={"/login"} className="font-bold text-smoke">
          {" "}
          Login now
        </NavLink>
      </p>
      <div>
        <h1 className="text-4xl font-bold">Verification email</h1>
        <h1 className="text-4xl font-bold py-[5px]">is already sent to you.</h1>
        <p className="text-[13px] text-gray-500 pt-[5px]">
          Verification email is already sent to your email.So please check your
          email.
        </p>{" "}
      </div>
    </div>
  );
};
