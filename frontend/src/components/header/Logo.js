import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";

const Logo = ({ imageUrl, logoClass,width,height}) => {
  return (
    <div className={clsx(logoClass)}>
      <Link to={process.env.PUBLIC_URL + "/"}>
        <img alt="" src={process.env.PUBLIC_URL + imageUrl} 
        className={`w-${width} h-${height} object-contain`}
        />
      </Link>
    </div>
  );
};

Logo.propTypes = {
  imageUrl: PropTypes.string,
  logoClass: PropTypes.string,
  width: PropTypes.string, 
  height: PropTypes.string
};

export default Logo;
