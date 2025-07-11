import React, { useState } from "react";
import Logo from "../assets/auth/Bakti.svg";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Menu, ChevronDown, LogOut, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: "Home", hash: "#home" },
    { label: "About", hash: "#about" },
    { label: "Maskot", hash: "#maskot" },
    { label: "Timeline", hash: "#timeline" },
    // Task & Gallery akan ditambah manual di bawah
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="w-full fixed top-0 z-20 shadow-md backdrop-blur bg-[#F6EDDD]/60">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[70px] items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src={Logo} alt="Bakti" className="w-12 h-[65px]" />
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
              {/* Task */}
              <Link
                to="/pengumpulantugas"
                className="px-10 py-1 rounded-full font-semibold text-yellow-900 hover:text-[#623B1C] hover:shadow-md hover:bg-white transition"
              >
                Task
              </Link>
              {/* Gallery */}
              <HashLink
                smooth
                to="/#gallery"
                className="px-10 py-1 rounded-full font-semibold text-yellow-900 hover:text-[#623B1C] hover:shadow-md hover:bg-white transition"
              >
                Gallery
              </HashLink>
            </div>

            {/* Login/User Button */}
            <div className="hidden md:block ml-auto">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown((prev) => !prev)}
                      className="flex items-center gap-2 text-[#623B1C] font-medium px-4 py-2 rounded-full hover:bg-[#f6eddd] transition cursor-pointer"
                    >
                      Hi, {user?.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          showDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in">
                        {user?.role === "ADMIN" && (
                          <Link
                            to="/absensi"
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-gray-50 transition rounded-t-xl"
                            onClick={() => setShowDropdown(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            toast.success(`Sampai jumpa, ${user?.name || ""}`);
                            logout();
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition rounded-b-xl cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
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
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-end p-4 md:hidden ml-auto">
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#623B1C] focus:outline-none"
          >
            <Menu size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-col p-6 space-y-4">
          {isAuthenticated && (
            <p className="text-[#623B1C] font-medium mb-2 border-b pb-4">
              Hi, {user?.name}
            </p>
          )}

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
          {/* Task */}
          <Link
            to="/pengumpulantugas"
            onClick={() => setIsOpen(false)}
            className="text-[#623B1C] font-semibold"
          >
            Task
          </Link>
          {/* Gallery */}
          <HashLink
            smooth
            to="/#gallery"
            onClick={() => setIsOpen(false)}
            className="text-[#623B1C] font-semibold"
          >
            Gallery
          </HashLink>

          {isAuthenticated ? (
            <>
              {user?.role === "ADMIN" && (
                <Link
                  to="/absensi"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600 font-semibold border px-6 py-2 rounded-full text-left hover:text-[#623B1C] hover:bg-white transition"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-yellow-900 font-semibold border px-6 py-2 rounded-full text-left hover:text-[#623B1C] hover:bg-white transition cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="text-yellow-900 font-semibold border px-6 py-2 rounded-full text-left hover:text-[#623B1C] hover:bg-white transition"
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
