import { Suspense, lazy } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/router-protector/ProtectedRoute";
import AdminRouteProtector from "./components/router-protector/AdminRouteProtector";
import SampleProductCatalogue from "./pages/other/SampleProductCatalogue";
import UnauthorizedPage from "./pages/admin/Unauthorized_Page";
import Unauthorized_Client_Page from "./pages/admin/Unauthorized_Client_Page";
import ClientRouteProtector from "./components/router-protector/ClientRouteProtector";
// import SampleProductDetail from "./pages/other/SampleProductDetail";

const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));
const ForgotPassword = lazy(() => import("./pages/other/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/other/ResetPassword"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));

// product pages
const ProductListPage = lazy(() => import("./pages/products/ProductListPage"));
const ProductDetailPage = lazy(() =>
  import("./pages/products/ProductDetailPage")
);

//Cart Checkout
const Cart = lazy(() => import("./pages/other/Cart"));
const Checkout = lazy(() => import("./pages/other/Checkout"));

//Admin Management Page
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const RegisteredUsers = lazy(() => import("./pages/admin/RegisteredUsers"));
const AdminProductManagement = lazy(() =>
  import("./pages/admin/AdminProductManagement")
);

const AdminCategoryManagement = lazy(() =>
  import("./pages/admin/AdminCategoryManagement")
);

const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true, // Keep the previous flag!
        v7_relativeSplatPath: true, // Add the new flag
      }}
    >
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
            <Route
              path={process.env.PUBLIC_URL + "/product-list"}
              element={
                <ClientRouteProtector>
                  <SampleProductCatalogue />
                </ClientRouteProtector>
              }
            />
            {/* <Route
              path={process.env.PUBLIC_URL + "/sampleproduct/:slug"}
              element={<SampleProductDetail />}
            /> */}

            <Route path={process.env.PUBLIC_URL + "/cart"} element={<Cart />} />
            <Route
              path={process.env.PUBLIC_URL + "/checkout"}
              element={
                <ClientRouteProtector>
                  <Checkout />
                </ClientRouteProtector>
              }
            />

            <Route
              path={process.env.PUBLIC_URL + "/"}
              element={
                <ClientRouteProtector>
                  <ProductListPage />
                </ClientRouteProtector>
              }
            />

            {/* Route for individual product detail page with dynamic product ID */}
            <Route
              path={process.env.PUBLIC_URL + "/product/:slug"}
              element={
                <ClientRouteProtector>
                  <ProductDetailPage />
                </ClientRouteProtector>
              }
            />

            {/* Protected routes for not logged in user */}
            <Route
              path={process.env.PUBLIC_URL + "/my-account"}
              element={
                <ProtectedRoute>
                  <MyAccount />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/dashboard"
              element={
                <AdminRouteProtector>
                  <Dashboard />
                </AdminRouteProtector>
              }
            />

            {/* Admin User management page */}
            <Route
              path={process.env.PUBLIC_URL + "/registered-users"}
              element={
                <AdminRouteProtector>
                  <RegisteredUsers />
                </AdminRouteProtector>
              }
            />

            {/* Admin Product Management */}
            <Route
              path={process.env.PUBLIC_URL + "/admin-product"}
              element={
                <AdminRouteProtector>
                  <AdminProductManagement />
                </AdminRouteProtector>
              }
            />

            {/* Admin Category Management */}
            <Route
              path="/manage-categories"
              element={
                <AdminRouteProtector>
                  <AdminCategoryManagement />
                </AdminRouteProtector>
              }
            />

            <Route path="/unauthorized-access" element={<UnauthorizedPage />} />
            <Route path="/unauthorized-admin-access" element={<Unauthorized_Client_Page />} />
          </Routes>
        </Suspense>
      </ScrollToTop>
    </Router>
  );
};

export default App;
