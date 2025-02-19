import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
} from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";

const PaymentStatus = ({ status }) => {
  const navigate = useNavigate();

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <>
            <CardHeader title="Payment Successful!" />
            <CardContent>
              <div className="flex items-center justify-center mb-4 text-green-500">
                <FaCheckCircle size={48} />
              </div>
              <p className="text-gray-700 mb-4">
                Your payment was completed successfully. Thank you for your
                purchase!
              </p>
              <Button onClick={() => navigate("/")} variant="primary">
                Go to Home
              </Button>
            </CardContent>
          </>
        );
      case "failure":
        return (
          <>
            <CardHeader title="Payment Failed" />
            <CardContent>
              <div className="flex items-center justify-center mb-4 text-red-500">
                <FaTimesCircle size={48} />
              </div>
              <p className="text-gray-700 mb-4">
                Your payment could not be processed. Please try again.
              </p>
              <Button onClick={() => navigate("/checkout")} variant="secondary">
                Try Again
              </Button>
            </CardContent>
          </>
        );
      default:
        return (
          <>
            <CardHeader title="Unknown Status" />
            <CardContent>
              <div className="flex items-center justify-center mb-4 text-yellow-500">
                <FaQuestionCircle size={48} />
              </div>
              <p className="text-gray-700 mb-4">
                There was an issue determining the payment status.
              </p>
              <Button onClick={() => navigate("/")} variant="primary">
                Go to Home
              </Button>
            </CardContent>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-indigo-300">
      <Card>{renderContent()}</Card>
    </div>
  );
};

export default PaymentStatus;
