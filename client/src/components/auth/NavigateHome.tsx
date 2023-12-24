import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const NavigateHome = () => {
  const { access_token } = useSelector((state: RootState) => state.auth);
  return access_token ? <Navigate to={"/"} replace /> : <Outlet />;
};
