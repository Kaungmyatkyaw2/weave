import LoadingButton from "@/shared/others/LoadingButton";
import { useState } from "react";
import axiosClient from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthPageWrapper } from "@/components/layout";
import { useDispatch } from "react-redux";
import { login } from "@/store/slice/auth.slice";

export const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [searchParam] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { toast } = useToast();

  const onVerifyEmail = async () => {
    try {
      setIsLoading(true);
      const res = await axiosClient().post(
        `users/verifyEmail/${searchParam.get("token")}`
      );
      toast({
        title: "Succesfully verify your email",
      });
      setIsLoading(false);
      setIsSuccess(true);
      dispatch(login(res.data.token));
    } catch (error: any) {
      toast({
        title: "Failed to sign up.",
        description: error.response.data.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthPageWrapper>
      <div className=" w-[400px]">
        {!isSuccess ? (
          <>
            <h1 className="text-3xl font-bold">Verify your email?</h1>
            <p className="py-[15px] text-sm text-smoke">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et nam
              fugiat corrupti, incidunt quod culpa omnis possimus debitis
              quisquam
            </p>
            <LoadingButton onClick={onVerifyEmail} loading={isLoading}>
              Verify
            </LoadingButton>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              Succesfully verify your email.
            </h1>
            <p className="py-[15px] text-sm text-smoke">
              You can use our app now.
            </p>
            <LoadingButton
              onClick={() => {
                navigate("/");
              }}
            >
              Start now
            </LoadingButton>
          </>
        )}
      </div>
    </AuthPageWrapper>
  );
};
