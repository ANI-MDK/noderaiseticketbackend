import React, { StrictMode, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Lazy load the App component
const App = React.lazy(() => import("./App.jsx"));

// Fallback Component that handles loading state for 5 seconds
const Fallback = () => {
  const [showFallback, setShowFallback] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(false); // After 5 seconds, stop showing the fallback
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  return (
    <div
      className="flex justify-center items-center text-center"
      style={{ height: "100vh" }}
    >
      {showFallback ? (
        <div className="border-t-3 rounded-full h-20 w-20 border-blue-600 rotate-180 transition-all ease-linear animate-spin duration-300"></div>
      ) : (
        <p className="text-xl font-medium">Still loading, please wait...</p>
      )}
    </div>
  );
};

// Main render
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Suspense fallback={<Fallback />}>
      <App />
    </Suspense>
  </BrowserRouter>
);
