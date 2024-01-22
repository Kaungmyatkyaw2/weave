import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ForgotPassword,
  Login,
  ResetPassword,
  Signup,
  VerifyEmail,
  GetVerificationEmail,
  UserPage,
  Search,
  Home,
  PostPage,
} from "./pages/";
import { LayoutProvider } from "./components/layout";
import { NavigateHome, Protect } from "./components/auth";
import { RootState } from "./store/store";
import { useSelector } from "react-redux";

const App = () => {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  return (
    <BrowserRouter>
      <section className={`${isDarkMode ? "dark" : ""} min-h-screen w-full bg-white`}>
        <Routes>
          <Route
            path="/"
            element={
              <LayoutProvider>
                <Protect />
              </LayoutProvider>
            }
          >
            <Route path="" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/user/:id" element={<UserPage />} />
            <Route path="/post/:id" element={<PostPage />} />
          </Route>
          <Route path="/" element={<NavigateHome />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verifyEmail" element={<VerifyEmail />} />
            <Route
              path="/getVerificationEmail"
              element={<GetVerificationEmail />}
            />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
          </Route>
        </Routes>
      </section>
    </BrowserRouter>
  );
};

export default App;
