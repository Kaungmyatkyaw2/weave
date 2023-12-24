import axiosClient from "@/lib/axios";
import { removeToken } from "@/store/slice/auth.slice";
import { removeCurrentUser, setCurrentUser } from "@/store/slice/user.slice";
import { RootState } from "@/store/store";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const Protect = () => {
  const { access_token } = useSelector((state: RootState) => state.auth);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const isLoggedIn = access_token && currentUser;

  const getMe = async () => {
    try {
      const res = await axiosClient().get("/users/me");
      dispatch(setCurrentUser(res.data.data.data));
    } catch (error) {
      dispatch(removeToken());
      dispatch(removeCurrentUser());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (access_token && !currentUser) {
      getMe();
    } else {
      setIsLoading(false);
    }
  }, [access_token]);

  if (!access_token) {
    return <Navigate to={"/login"} replace />;
  }

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 h-[100vh] w-full flex flex-col items-center justify-center z-[9999] bg-white">
        <Loader className="animate-spin" size={30} />
        <p className="text-gray-500">Aunthenticating. Please wait!</p>
      </div>
    );
  }

  return isLoggedIn ? <Outlet /> : <Navigate to={"/login"} replace />;
};
