import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-md mx-auto transform hover:scale-105 transition duration-300 ease-in-out">
      {children}
    </div>
  );
};

const CardHeader = ({ title }) => {
  return (
    <div className="border-b pb-4 mb-4">
      <h2 className="text-3xl font-extrabold text-gray-800">{title}</h2>
    </div>
  );
};

const CardContent = ({ children }) => {
  return <div className="text-lg text-gray-600">{children}</div>;
};

const Button = ({ onClick, children, variant = "primary" }) => {
  const baseStyle =
    "px-6 py-2 rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105";
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300 shadow-md",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyles[variant]} block ml-auto`}
    >
      {children}
    </button>
  );
};

export { Card, CardHeader, CardContent, Button };
