"use client";

/**
 * Loading component displays a loading animation while data is being fetched.
 * It's designed to be used as a fallback for Suspense boundaries.
 *
 * @returns {JSX.Element} A React functional component that renders a loading animation.
 */
import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
    </div>
  );
};

export default Loading;
