import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToNewsletter } from "../../../store/slices/news-slice";
import { MoonLoader } from "react-spinners";

const CustomForm = ({ status, message, onValidated }) => {
  const dispatch = useDispatch();
  const { status: newsStatus, error: newsError } = useSelector(
    (state) => state.news
  );
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // Email validation regex pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubscribe = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setValidationError("Email is required.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    setValidationError(""); // Clear error if valid
    dispatch(subscribeToNewsletter(email)); // request to subscribe email
    setEmail("");
  };

  // Hide news status messages after 5 seconds and validation errors in 3 seconds
  useEffect(() => {
    let timer;
    if (validationError) {
      timer = setTimeout(() => setValidationError(""), 3000);
    } else if (
      newsStatus === "subscribe-success" ||
      newsStatus === "subscribe-loading" ||
      newsStatus === "subscribe-error"
    ) {
      setShowMessage(true);
      timer = setTimeout(() => setShowMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [newsStatus, validationError]);

  return (
    <div className="subscribe-form">
      <div className="mc-form">
        <div>
          <input
            id="mc-form-email"
            type="email"
            className="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="clear">
          <button
            className={`button ${
              newsStatus === "subscribe-loading"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleSubscribe}
            disabled={newsStatus === "subscribe-loading"}
          >
            SUBSCRIBE
          </button>
        </div>
      </div>

      {showMessage && newsStatus === "subscribe-loading" && (
        <div
          style={{ color: "#3498db", fontSize: "12px" }}
          className="flex items-center"
        >
          <MoonLoader size={10} color="#3498db" className="mr-2" />
          Subscribing...
        </div>
      )}
      {showMessage && newsStatus === "subscribe-error" && (
        <div style={{ color: "#e74c3c", fontSize: "12px" }}>{newsError}</div>
      )}
      {validationError && (
        <div style={{ color: "#e74c3c", fontSize: "12px" }}>
          {validationError}
        </div>
      )}
      {showMessage && newsStatus === "subscribe-success" && (
        <div style={{ color: "#2ecc71", fontSize: "12px" }}>
          Subscribed for news letters success!
        </div>
      )}
    </div>
  );
};

const SubscribeEmail = ({ mailchimpUrl }) => {
  return (
    <div>
      <MailchimpSubscribe
        url={mailchimpUrl}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            onValidated={(formData) => subscribe(formData)}
          />
        )}
      />
    </div>
  );
};

SubscribeEmail.propTypes = {
  mailchimpUrl: PropTypes.string,
};

export default SubscribeEmail;
