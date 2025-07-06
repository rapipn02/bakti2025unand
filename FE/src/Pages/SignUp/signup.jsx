import { useState } from "react";
import { Link } from "react-router-dom";
import backgroundSignup from "../../assets/signup/newsignup.svg";
import RumahGadang2 from "../../assets/signup/rumahgadang1.svg";
import RumahGadangMobile from "../../assets/Login/BAKTI UNAND 2025 kiri.svg";
import Forwardbutton from "../../assets/signup/Forward Button (1).svg";
import BaktiUnandLogo from "../../assets/Login/Bakti.svg";

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row">
      {/* Background Mobile */}
      <div
        className="absolute inset-0 w-full h-full bg-[#fefaf1] bg-cover bg-center bg-no-repeat -z-10 md:hidden"
        style={{ backgroundImage: `url(${RumahGadangMobile})` }}
      >
        <div className="absolute inset-0 backdrop-blur-md bg-[#fefaf1]/30" />
      </div>

      {/* Background Desktop */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center -z-10 hidden md:block"
        style={{ backgroundImage: `url(${backgroundSignup})` }}
      ></div>

      {/* Kolom Kiri (Desktop) */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center ">
        <img
          src={RumahGadang2}
          alt="rumahgadang"
          className="absolute left-0 bottom-0 h-full w-full object-contain z-10"
        />
        <div
          className="z-20 text-center px-6 absolute top-[10%] mr-[3rem]"
          style={{
            textShadow: `
              -2px -2px 0 white,
              2px -2px 0 white,
              -2px 2px 0 white,
              2px 2px 0 white,
              0 0 10px rgba(0, 0, 0, 0.5),
              0 0 15px rgba(0, 0, 0, 0.4)
            `,
          }}
        >
          <h1 className="text-2xl font-['Titan_One'] text-[#623B1C] drop-shadow-lg">
            Selamat Datang <br /> di
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-['Titan_One'] text-[#623B1C] drop-shadow-lg mt-2">
            <span className="block">BAKTI UNAND</span>
            <span className="block">2025</span>
          </h2>
        </div>

        {/* Desktop Link ke Login */}
        <div className="absolute bottom-[9.5rem] left-1/2 transform -translate-x-1/2 z-20 text-center font-[Poppins] text-sm text-white">
          <div className="text-base sm:text-lg">Sudah punya akun?</div>
          <Link
            to="/login"
            className="mt-2 inline-flex items-center justify-center gap-2 w-[335px] h-11.5 text-xl font-semibold text-white border-2 border-[#623B1C] bg-[#CAAD8C] rounded-[20px] hover:bg-[#623B1C] hover:text-white transition relative hover:scale-105"
          >
            Masuk
            <img
              className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2"
              src={Forwardbutton}
              alt="forwardicon"
            />
          </Link>
        </div>
      </div>

      {/* Kolom Kanan (Formulir) */}
      <div className="w-full md:w-1/2 flex flex-col z-20 px-8 py-10 md:justify-center md:bg-[#fefaf1]">
        {/* Logo dan Tulisan Mobile */}
        <div className="md:hidden flex justify-start items-center mb-6">
          <img src={BaktiUnandLogo} alt="Bakti Unand" className="h-9 mr-2" />
          <span className="text-lg font-semibold font-['Titan_One'] bg-gradient-to-b from-[#623B1C] to-[#F6EDDD] text-transparent bg-clip-text">
            BAKTI UNAND
          </span>
        </div>

        {/* Judul */}
        <div
          className="text-[#623B1C] text-4xl font-['Titan_One'] text-center"
          style={{
            textShadow: `
            -2px -2px 0 white,
            2px -2px 0 white,
            -2px 2px 0 white,
            2px 2px 0 white,
            0 0 10px rgba(0, 0, 0, 0.5),
            0 0 15px rgba(0, 0, 0, 0.4)
          `,
          }}
        >
          Daftar disini
          <div className="w-[98%] sm:w-[380px] h-1 bg-yellow-900 mx-auto mt-4" />
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-4 w-full max-w-sm mx-auto text-[#603813] font-semibold mt-8"
          style={{ textShadow: "0px 1px 2px rgba(255, 255, 255, 0.7)" }}
        >
          {/* Nama Pengguna */}
          <div>
            <label className="block mb-2">Nama Pengguna</label>
            <input
              type="text"
              placeholder="Masukkan Nama Pengguna"
              className="w-full px-4 py-3 rounded-xl border border-[#a67c52] bg-[#fefaf1] placeholder:text-[#c0a68a] focus:outline-none focus:ring-1 focus:ring-[#8D6E63]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              placeholder="Masukkan Email"
              className="w-full px-4 py-3 rounded-xl border border-[#a67c52] bg-[#fefaf1] placeholder:text-[#c0a68a] focus:outline-none focus:ring-1 focus:ring-[#8D6E63]"
            />
          </div>

          {/* Kata Sandi */}
          <div>
            <label className="block mb-2">Kata Sandi</label>
            <div className="flex items-center border border-[#a67c52] rounded-xl px-4 py-3 bg-[#fefaf1] focus-within:ring-1 focus-within:ring-[#8D6E63]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan Kata Sandi"
                className="flex-1 outline-none placeholder:text-[#c0a68a] bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 focus:outline-none"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#603813]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#603813]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.124-3.292M6.1 6.1A10.042 10.042 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.042 10.042 0 01-4.121 5.131M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Konfirmasi Kata Sandi */}
          <div>
            <label className="block mb-2">Konfirmasi Kata Sandi</label>
            <div className="flex items-center border border-[#a67c52] rounded-xl px-4 py-3 bg-[#fefaf1] focus-within:ring-1 focus-within:ring-[#8D6E63]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi Kata Sandi"
                className="flex-1 outline-none placeholder:text-[#c0a68a] bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="ml-2 focus:outline-none"
              >
                {showConfirmPassword ? (
                  // Mata terbuka (eye)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#603813]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  // Mata tertutup (eye-off)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#603813]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.124-3.292M6.1 6.1A10.042 10.042 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.042 10.042 0 01-4.121 5.131M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Tombol Daftar */}
          <button className="w-full bg-[#8D6E63] text-white font-bold py-3 mt-6 rounded-xl shadow-md hover:bg-[#6D4C41] transition duration-300 hover:scale-105 cursor-pointer">
            DAFTAR
          </button>

          {/* Link Mobile ke Login */}
          <div className="md:hidden text-center mt-8">
            <p className="text-sm text-[#623B1C]">Sudah punya akun?</p>
            <Link to="/login" className="text-[#623B1C] font-bold underline ">
              Masuk
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
