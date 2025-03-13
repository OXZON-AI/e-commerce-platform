import React, { useEffect, useState } from "react";
import { MailX } from "lucide-react";
import NewslettersImg from "../../assets/images/Newsletters.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { unsubscribeFromNewsletter } from "../../store/slices/news-slice";

const UnsubscribeNews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subscriberToken = searchParams.get("token"); // Get the subscriber token from the URL
  const { status, error } = useSelector((state) => state.news);
  const [message, setMessage] = useState("");

  // effect hook for check token availability
  useEffect(() => {
    if (!subscriberToken) {
      setMessage(
        "Invalid or missing token. Unable to process unsubscribe request."
      );
    }
  }, [subscriberToken]);

  const handleUnsubscribe = async () => {
    if (!subscriberToken) {
      setMessage("Invalid request. Token is missing.");
      return;
    }
    try {
      await dispatch(unsubscribeFromNewsletter(subscriberToken)).unwrap();
    } catch (error) {
      console.log("Faield to unsubscribe user : ", error);
      setMessage(error || "Failed to unsubscribe. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-lg p-6 rounded-2xl text-center">
        <div>
          <MailX className="mx-auto text-red-500" size={28} />
          <img
            src={NewslettersImg}
            alt="newsletter image"
            className="mx-auto my-4 w-1/2"
          />
          <h2 className="text-2xl font-semibold mt-4">
            Unsubscribe from Newsletter
          </h2>
          <p className="text-gray-600 mt-2">
            We're sorry to see you go! By unsubscribing, you might miss out on:
          </p>
          <ul className="list-disc text-left text-gray-600 mt-2 ml-6 pl-6">
            <li>Exciting new arrivals at our latest shop.</li>
            <li>Exclusive special offers and discounts just for you.</li>
            <li>Handpicked collections tailored to your preferences.</li>
          </ul>
          <p className="mt-2 text-gray-600">
            Click the button below to confirm your unsubscription from our
            mailing list.
          </p>
          <button
            className={`mt-4 bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-md ${
              message ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={message}
            onClick={handleUnsubscribe}
          >
            {error?.includes("Invalid token") ? "Already Unsubscribed" : "Unsubscribe"}
          </button>

          <p
            className={`mt-4 text-sm ${
              status === "unsubscribe-loading"
                ? "text-gray-500"
                : status === "unsubscribe-success"
                ? "text-green-600"
                : status === "unsubscribe-error" || message
                ? "text-red-500"
                : ""
            }`}
          >
            {status === "unsubscribe-loading" && "Unsubscribing..."}
            {status === "unsubscribe-success" && "Successfully Unsubscribed!"}
            {status === "unsubscribe-error" &&
              (error.includes("Invalid token")
                ? "You have already unsubscribed."
                : error)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribeNews;
