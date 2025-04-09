// WelcomePage.jsx

import Link from "next/link";
import React from "react";

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 md:p-12 text-center">
        <div className="mb-6">
          <div className="text-5xl font-extrabold text-purple-600 mb-2">🎓</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome in  AI Lesson Plan Generator
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Create personalized, engaging, and curriculum-aligned lesson plans in seconds—powered by AI and built for educators.
          </p>
        </div>

        <Link href={"/chat"}>
          <button className="mt-6 bg-purple-600 text-white text-base md:text-lg font-semibold py-3 px-6 rounded-xl hover:bg-purple-700 transition duration-200 shadow-md">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
