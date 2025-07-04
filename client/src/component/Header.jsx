import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-white/10 py-4">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2">
          {/* Camera Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-blue-500"
          >
            <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
            <path
              fillRule="evenodd"
              d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>

          {/* App Title */}
          <h1 className="text-xl font-bold text-white">
            <span className="text-blue-500">Ai</span>Selfie
            <span className="text-red-500">With</span>ElonMusk
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
