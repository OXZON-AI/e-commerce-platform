import React, { useState } from "react";
import { MailX } from "lucide-react";
import NewslettersImg from "../../assets/images/Newsletters.svg";

const UnsubscribeNews = () => {
  const [message, setMessage] = useState("");

  const handleUnsubscribe = () => {
    setMessage("You have successfully unsubscribed from our newsletter.");
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
          <h2 className="text-2xl font-semibold mt-4">Unsubscribe from Newsletter</h2>
          <p className="text-gray-600 mt-2">
            We’re sorry to see you go! By unsubscribing, you might miss out on:
          </p>
          <ul className="list-disc text-left text-gray-600 mt-2 ml-6 pl-6">
            <li>Exciting new arrivals at our latest shop.</li>
            <li>Exclusive special offers and discounts just for you.</li>
            <li>Handpicked collections tailored to your preferences.</li>
          </ul>
          <p className="mt-2 text-gray-600">
            Click the button below to confirm your unsubscription from our mailing list.
          </p>
          <button
            className="mt-4 bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-md"
            onClick={handleUnsubscribe}
          >
            Unsubscribe
          </button>
          {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default UnsubscribeNews;
