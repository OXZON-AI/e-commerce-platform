// import React from "react";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   Button,
// } from "../../components/ui/card";
// import { useNavigate } from "react-router-dom";
// import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";

// const PaymentStatus = ({ status }) => {
//   const navigate = useNavigate();

//   const renderContent = () => {
//     switch (status) {
//       case "success":
//         return (
//           <>
//             <CardHeader title="Payment Successful!" />
//             <CardContent>
//               <div className="flex items-center justify-center mb-4 text-green-500">
//                 <FaCheckCircle size={48} />
//               </div>
//               <p className="text-gray-700 mb-4">
//                 Your payment was completed successfully. Thank you for your
//                 purchase!
//               </p>
//               <Button onClick={() => navigate("/")} variant="primary">
//                 Go to Home
//               </Button>
//             </CardContent>
//           </>
//         );
//       case "failure":
//         return (
//           <>
//             <CardHeader title="Payment Failed" />
//             <CardContent>
//               <div className="flex items-center justify-center mb-4 text-red-500">
//                 <FaTimesCircle size={48} />
//               </div>
//               <p className="text-gray-700 mb-4">
//                 Your payment could not be processed. Please try again.
//               </p>
//               <Button onClick={() => navigate("/checkout")} variant="secondary">
//                 Try Again
//               </Button>
//             </CardContent>
//           </>
//         );
//       default:
//         return (
//           <>
//             <CardHeader title="Unknown Status" />
//             <CardContent>
//               <div className="flex items-center justify-center mb-4 text-yellow-500">
//                 <FaQuestionCircle size={48} />
//               </div>
//               <p className="text-gray-700 mb-4">
//                 There was an issue determining the payment status.
//               </p>
//               <Button onClick={() => navigate("/")} variant="primary">
//                 Go to Home
//               </Button>
//             </CardContent>
//           </>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-indigo-300">
//       <Card>{renderContent()}</Card>
//     </div>
//   );
// };

// export default PaymentStatus;

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";
import PaymentsuccessImg from "../../assets/images/paymentsuccess.svg"

const PaymentStatus = ({ status }) => {
  const navigate = useNavigate();

  const renderContent = () => {
    switch (status) {
      case "success":
        return {
          title: "Payment Successful!",
          icon: <FaCheckCircle size={28} className="mx-auto text-green-500" />,
          message: "Your payment was completed successfully. Thank you for your purchase!",
          buttonText: "Continue Shopping",
          buttonAction: () => navigate("/"),
        };
      case "failure":
        return {
          title: "Payment Failed",
          icon: <FaTimesCircle size={28} className="mx-auto text-red-500" />,
          message: "Your payment could not be processed. Please try again.",
          buttonText: "Try Again",
          buttonAction: () => navigate("/checkout"),
        };
      default:
        return {
          title: "Unknown Status",
          icon: <FaQuestionCircle size={28} className="mx-auto text-yellow-500" />,
          message: "There was an issue determining the payment status.",
          buttonText: "Go to Home",
          buttonAction: () => navigate("/"),
        };
    }
  };

  const { title, icon, message, buttonText, buttonAction } = renderContent();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-lg p-6 rounded-2xl text-center">
        <div>
          {/* {icon} */}
          <img
            src={PaymentsuccessImg} // Replace with your relevant image
            alt="payment-status"
            className="mx-auto my-4 w-1/2"
          />
          <h2 className="text-2xl font-semibold mt-4">{title}</h2>
          <p className="text-gray-600 mt-2">{message}</p>
          <button
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white w-full py-2 rounded-md"
            onClick={buttonAction}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
