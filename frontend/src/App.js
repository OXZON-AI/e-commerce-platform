import { Suspense, lazy } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/router-protector/ProtectedRoute";

const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));
const ForgotPassword = lazy(() => import("./pages/other/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/other/ResetPassword"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));

//Admin User Management Page
const RegisteredUsers = lazy(() => import("./pages/admin/RegisteredUsers"));

const App = () => {
  return (
    <Router>
      <ScrollToTop>
        <Suspense
          fallback={
            <div className="flone-preloader-wrapper">
              <div className="flone-preloader">
                <span></span>
                <span></span>
              </div>
            </div>
          }
        >
          <Routes>
            {/* Public routes */}
            <Route
              path={process.env.PUBLIC_URL + "/login-register"}
              element={<LoginRegister />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/forgot-password"}
              element={<ForgotPassword />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/reset-password"}
              element={<ResetPassword />}
            />

            {/* Protected routes */}
            <Route
              path={process.env.PUBLIC_URL + "/my-account"}
              element={
                <ProtectedRoute>
                  <MyAccount />
                </ProtectedRoute>
              }
            />

            {/* Admin User management page */}
            <Route
              path={process.env.PUBLIC_URL + "/registered-users"}
              element={<RegisteredUsers />}
            />
          </Routes>
        </Suspense>
      </ScrollToTop>
    </Router>
  );
};

export default App;
