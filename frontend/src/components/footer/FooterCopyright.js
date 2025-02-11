import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";

const FooterCopyright = ({
  footerLogo,
  spaceBottomClass,
  colorClass,
  logoClass,
}) => {
  return (
    <div className={clsx("copyright", spaceBottomClass, colorClass)}>
      <div className="footer-logo">
        <Link to={process.env.PUBLIC_URL + "/"}>
          <img
            alt="Footer Logo"
            src={process.env.PUBLIC_URL + footerLogo}
            className={logoClass} // Apply dynamic logo class
          />
        </Link>
      </div>
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://hasthemes.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Genuine Electronics
        </a>
        .<br /> All Rights Reserved
      </p>
    </div>
  );
};

FooterCopyright.propTypes = {
  footerLogo: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  logoClass: PropTypes.string, // PropType for dynamic class
};

export default FooterCopyright;
