import { Suspense, lazy } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/router-protector/ProtectedRoute";
import AdminRouteProtector from "./components/router-protector/AdminRouteProtector";
import SampleProductCatalogue from "./pages/other/SampleProductCatalogue";
import UnauthorizedPage from "./pages/admin/Unauthorized_Page";
import Unauthorized_Client_Page from "./pages/admin/Unauthorized_Client_Page";
import ClientRouteProtector from "./components/router-protector/ClientRouteProtector";
import MenuCart from "./components/header/sub-components/MenuCart";
import AdminOrderManagement from "./pages/admin/AdminOrderManagement";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";

// import SampleProductDetail from "./pages/other/SampleProductDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));
const ForgotPassword = lazy(() => import("./pages/other/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/other/ResetPassword"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));

// product pages
const ProductListPage = lazy(() => import("./pages/products/ProductListPage"));
const ProductDetailPage = lazy(() =>
  import("./pages/products/ProductDetailPage")
);
const OrderHistory = lazy(() => import("./pages/products/OrderHistory"));

//success_fail
const PaymentSuccess = lazy(() => import("./pages/other/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/other/PaymentFailure"));

//home pages
const HomeElectronics = lazy(() => import("./pages/home/HomeElectronics"));
const AboutUs = lazy(() => import("./pages/home/AboutUs"));
const ContactUs = lazy(() => import("./pages/home/ContactUs"));
const FAQ = lazy(() => import("./pages/home/FAQ"));

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
              path={process.env.PUBLIC_URL + "/menu_cart"}
              element={<MenuCart />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/forgot-password"}
              element={<ForgotPassword />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/reset-password"}
              element={<ResetPassword />}
            />

            <Route path="/payment-success" element={<PaymentSuccess />} />

            <Route path="/payment-failure" element={<PaymentFailure />} />

            <Route
              path={process.env.PUBLIC_URL + "/"}
              element={<HomeElectronics />}
            />

            <Route
              path={process.env.PUBLIC_URL + "/order-history"}
              element={<OrderHistory />}
            />

            <Route
              path={process.env.PUBLIC_URL + "/about"}
              element={<AboutUs />}
            />

            <Route
              path={process.env.PUBLIC_URL + "/contact"}
              element={<ContactUs />}
            />

            <Route path={process.env.PUBLIC_URL + "/faqs"} element={<FAQ />} />

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
              path={process.env.PUBLIC_URL + "/product-catalogue"}
              element={
                <ClientRouteProtector>
                  <ProductListPage />
                </ClientRouteProtector>
              }
            />

            <Route
              path={process.env.PUBLIC_URL + "/product-catalogue/:categoryUrl"}
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
                  <ToastContainer position="bottom-right" autoClose={3000} />
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

            {/* Admin Order Management */}
            <Route path="/manage-orders" element={<AdminOrderManagement />} />
            <Route
              path={process.env.PUBLIC_URL + "/manage-orders"}
              element={
                <AdminRouteProtector>
                  <AdminOrderManagement />
                </AdminRouteProtector>
              }
            />

            <Route
              path="/manage-order-details"
              element={<AdminOrderDetail />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/manage-order-details"}
              element={
                <AdminRouteProtector>
                  <AdminOrderDetail />
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
            <Route
              path="/unauthorized-admin-access"
              element={<Unauthorized_Client_Page />}
            />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </Suspense>
      </ScrollToTop>
    </Router>
  );
};

export default App;
