import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center text-yellow-900 text-center px-4 bg-cover bg-center"
      style={{ backgroundImage: `url('/background.svg')` }}
    >
      <div className="-mt-[10.5rem]">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl font-semibold mb-6">Oops! Page Not Found</p>
        <Link
          to="/"
          className="bg-orange-200 inline-block hover:bg-orange-300 text-yellow-900 font-bold py-2 px-6 rounded-full shadow-md transform transition duration-300 ease-in-out hover:scale-110"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
