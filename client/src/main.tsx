import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ForgotPassword,
  Login,
  ResetPassword,
  Signup,
  VerifyEmail,
  GetVerificationEmail,
} from "./pages/";
import { Toaster } from "./components/ui/toaster.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { NavigateHome, Protect } from "./components/auth";
import { LayoutProvider } from "./components/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <LayoutProvider>
                  <Protect />
                </LayoutProvider>
              }
            >
              <Route path="" element={<App />} />
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
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </QueryClientProvider>
);
