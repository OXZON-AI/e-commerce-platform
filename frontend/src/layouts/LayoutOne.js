import PropTypes from "prop-types";
import { Fragment } from "react";
//import { ToastContainer } from "react-toastify";
import HeaderOne from "../wrappers/header/HeaderOne";
import FooterOne from "../wrappers/footer/FooterOne";
import ScrollToTop from "../components/scroll-to-top";
import { useSelector } from "react-redux";
import AdminNavbar from "../pages/admin/components/AdminNavbar";

const LayoutOne = ({
  children,
  headerContainerClass,
  headerTop,
  headerPaddingClass,
  headerPositionClass,
}) => {
  const { userInfo } = useSelector((state) => state.user);
  return (
    <Fragment>
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      {userInfo?.role === "admin" ? (
        <AdminNavbar />
      ) : (
        <HeaderOne
          layout={headerContainerClass}
          top={headerTop}
          headerPaddingClass={headerPaddingClass}
          headerPositionClass={headerPositionClass}
        />
      )}
      {children}
      <FooterOne
        backgroundColorClass="bg-gray"
        spaceTopClass="pt-100"
        spaceBottomClass="pb-70"
      />
      <ScrollToTop />
    </Fragment>
  );
};

LayoutOne.propTypes = {
  children: PropTypes.node,
  headerContainerClass: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  headerTop: PropTypes.string,
};

export default LayoutOne;
