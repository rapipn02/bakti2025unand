import React, { useState } from "react";
import Logo from "../assets/auth/Bakti.svg";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: "Home", hash: "#home" },
    { label: "About", hash: "#about" },
    { label: "Maskot", hash: "#maskot" },
    { label: "Timeline", hash: "#timeline" },
    { label: "Task", hash: "#task" },
    { label: "Gallery", hash: "#gallery" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="w-full fixed top-0 z-20 shadow-md backdrop-blur bg-[#F6EDDD]/60">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[70px] items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src={Logo} alt="Bakti" className="w-16 h-[65px]" />
              <div className="text-2xl font-bold text-[#623B1C] font-['Carena'] mt-2">
                BAKTI UNAND
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex ml-10 space-x-8">
              {navItems.map((item) => (
                <HashLink
                  key={item.label}
                  smooth
                  to={`/${item.hash}`}
                  className="px-10 py-1 rounded-full font-semibold text-yellow-900 hover:text-[#623B1C] hover:shadow-md hover:bg-white transition"
                >
                  {item.label}
                </HashLink>
              ))}
            </div>

            {/* Login/User Button */}
            <div className="hidden md:block ml-auto">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/absensi"
                      className="text-blue-600 font-bold px-6 py-2 rounded-full border border-blue-600 shadow-md hover:bg-blue-600 hover:text-white transition"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <span className="text-[#623B1C] font-medium">
                    Hi, {user?.name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-red-600 font-bold px-6 py-2 rounded-full border border-red-600 shadow-md hover:bg-red-600 hover:text-white transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-yellow-900 font-bold px-10 py-2 rounded-full border border-black shadow-md hover:text-[#623B1C] hover:bg-white transition"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden ml-auto">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-[#623B1C] focus:outline-none"
              >
                <Menu size={24} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#F6EDDD] shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full" // Logika buka/tutup
        } md:hidden`}
      >
        {/* Tombol untuk menutup sidebar */}
        <div className="flex justify-end p-4 md:hidden ml-auto">
          <button
            onClick={() => setIsOpen(false)} // Mengubah state isOpen menjadi false
            className="text-[#623B1C] focus:outline-none"
          >
            <Menu size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-col p-6 space-y-4">
          {navItems.map((item) => (
            <HashLink
              key={item.label}
              smooth
              to={`/${item.hash}`}
              onClick={() => setIsOpen(false)}
              className="text-[#623B1C] font-semibold"
            >
              {item.label}
            </HashLink>
          ))}
          
          {/* Mobile Auth Section */}
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/absensi"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600 font-semibold border-t pt-4"
                >
                  Admin Panel
                </Link>
              )}
              <div className="border-t pt-4">
                <p className="text-[#623B1C] font-medium mb-2">
                  Hi, {user?.name}
                </p>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-red-600 font-semibold"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="text-[#623B1C] font-semibold border-t pt-4"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
