import { Suspense, lazy } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/router-protector/ProtectedRoute";
import AdminRouteProtector from "./components/router-protector/AdminRouteProtector";
import SampleProductCatalogue from "./pages/other/SampleProductCatalogue";
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

//Admin Management Page
const RegisteredUsers = lazy(() => import("./pages/admin/RegisteredUsers"));
const AdminProductManagement = lazy(() =>
  import("./pages/admin/AdminProductManagement")
);

const AdminCategoryManagement = lazy(() =>
  import("./pages/admin/AdminCategoryManagement")
);

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
            <Route
              path={process.env.PUBLIC_URL + "/product-list"}
              element={<SampleProductCatalogue />}
            />
            {/* <Route
              path={process.env.PUBLIC_URL + "/sampleproduct/:slug"}
              element={<SampleProductDetail />}
            /> */}

            {/* Admin Product & Category Management */}
            <Route
              path={process.env.PUBLIC_URL + "/admin-product"}
              element={<AdminProductManagement />}
            />

            <Route
              path="/manage-categories"
              element={<AdminCategoryManagement />}
            />

            <Route
              path={process.env.PUBLIC_URL + "/"}
              element={<ProductListPage />}
            />

            {/* Route for individual product detail page with dynamic product ID */}
            <Route
              path={process.env.PUBLIC_URL + "/product/:slug"}
              element={<ProductDetailPage />}
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

            {/* Admin User management page */}
            <Route
              path={process.env.PUBLIC_URL + "/registered-users"}
              element={
                <AdminRouteProtector>
                  <RegisteredUsers />
                </AdminRouteProtector>
              }
            />
          </Routes>
        </Suspense>
      </ScrollToTop>
    </Router>
  );
};

export default App;
