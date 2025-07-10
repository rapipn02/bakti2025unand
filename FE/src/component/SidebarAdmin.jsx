import React from "react";
import { Link } from "react-router-dom";
import BaktiUnand from "../assets/Login/Bakti.svg";

const Sidebar = ({ className = "w-64" }) => {
  const menus = [
    { name: "List Absen", path: "/listabsen" },
    { name: "Absensi", path: "/absensi" },
    { name: "Kelompok", path: "/kelompok" },
    { name: "Anggota Kelompok", path: "/anggotakelompok" },
    { name: "Tugas", path: "/tugas" },
    { name: "Pengumpulan Tugas", path: "/kumpultugas" },
  ];

  return (
    <div
      className={`h-full bg-white flex flex-col ${className}`}
    >
      <div className="flex items-center justify-center gap-2 py-4 border-b px-4">
        <img
          src={BaktiUnand}
          alt="Logo Bakti Unand"
          className="w-8 h-8 object-contain"
        />
        <Link to="/">
          <h2 className="font-semibold text-lg whitespace-nowrap hover:text-blue-700 transition-colors cursor-pointer">
            BAKTI UNAND 2025
          </h2>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menus.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className="block px-4 py-2 rounded-lg text-left w-full hover:bg-gray-300 transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
