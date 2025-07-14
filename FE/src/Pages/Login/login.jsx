import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import toast from 'react-hot-toast';
import GoogleLoginButton from "../../components/GoogleLoginButton";

// Path gambar Anda
import backgroundLogin from "../../assets/Login/newlogin.webp";
import RumahGadang from "../../assets/Login/rumahgadang.webp";
import GoogleLogo from "../../assets/Login/Google.svg";
import BaktiUnandLogo from "../../assets/Login/Bakti.svg";
import Rumahgadangmobile from "../../assets/Login/BAKTI UNAND 2025 kiri.svg";
import Forwardbutton from "../../assets/Login/Forward Button.svg";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Email dan password harus diisi!");
      return;
    }

    const result = await login({ email, password });
    
    if (result.success) {
      toast.success(`Selamat Datang ${result.user?.name || ""}`);
      // Role-based redirect
      const userRole = result.user?.role;
      
      if (userRole === 'ADMIN') {
        navigate('/absensi'); // Admin ke halaman absensi
      } else {
        navigate('/'); // User biasa ke halaman utama
      }
    } else {
      toast.error(result.error || "Login gagal!");
    }
  };

  const handleGoogleSuccess = (userData) => {
    // Role-based redirect setelah Google login
    const userRole = userData?.role;
    
    if (userRole === 'ADMIN') {
      navigate('/absensi'); // Admin ke halaman absensi
    } else {
      navigate('/'); // User biasa ke halaman utama
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login error:', error);
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row ">
      {/* Background untuk Mobile dengan warna fallback */}
      <div
        className="absolute inset-0 w-full h-full bg-[#fefaf1] backdrop-blur-md bg-cover bg-center bg-no-repeat -z-10 md:hidden"
        style={{ backgroundImage: `url(${Rumahgadangmobile})` }}
      >
        <div className="absolute inset-0 backdrop-blur-md bg-[#fefaf1]/30" />
      </div>

      {/* Background untuk Desktop */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center -z-10 hidden md:block"
        style={{ backgroundImage: `url(${backgroundLogin})` }}
      ></div>

      {/* === KOLOM KIRI (FORMULIR) === */}
      <div className="w-full md:w-1/2 flex flex-col z-20 px-8 py-10 md:justify-center md:bg-[#fefaf1]">
        <div className="w-full max-w-sm mx-auto">
          <div className="md:hidden flex justify-start items-center mb-10">
            <img src={BaktiUnandLogo} alt="Bakti Unand" className="h-9 mr-2" />
            <span className="text-lg font-semibold font-['Titan_One'] bg-gradient-to-b from-[#623B1C] to-[#F6EDDD] text-transparent bg-clip-text">
              BAKTI UNAND
            </span>
          </div>

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
            Masuk Disini
            <div className="w-full h-1 bg-yellow-900 mx-auto mt-4" />
          </div>

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 text-[#603813] font-semibold mt-10"
            style={{ textShadow: "0px 1px 2px rgba(255, 255, 255, 0.7)" }}
          >
            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#a67c52] placeholder:text-[#c0a68a] bg-[#fefaf1] focus:outline-none focus:ring-1 focus:ring-[#8D6E63]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1">
                Kata Sandi
              </label>
              <div className="flex items-center border border-[#a67c52] rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-[#8D6E63] bg-[#fefaf1]">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 outline-none placeholder:text-[#c0a68a] bg-transparent"
                  required
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
              <div className="text-right text-sm mt-1">
                <Link
                  to="/lupasandi"
                  className="text-[#603813] hover:underline"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8D6E63] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#6D4C41] transition cursor-pointer mt-4 duration-300 hover:scale-105"
            >
              MASUK
            </button>

            <div className="text-center text-sm font-normal text-[#603813] my-2">
              atau
            </div>

            <GoogleLoginButton 
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={loading}
            />

            {/* Mobile-only Daftar section */}
            <div className="block md:hidden text-center mt-8">
              <p className="text-sm text-[#623B1C]">Belum punya akun?</p>
              <Link to="/signup" className="text-[#623B1C] font-bold underline">
                Daftar
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 relative items-center justify-center">
        <img
          src={RumahGadang}
          alt="rumahgadang"
          className="absolute right-0 bottom-0 h-full w-full object-contain z-10"
        />

        {/* Desktop Belum Punya Akun,Daftar */}
        <div
          className="z-20 text-center px-6 absolute top-[10%] left-1/2 transform -translate-x-1/2"
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

        <div className="absolute bottom-[9.5rem] left-1/2 transform -translate-x-1/2 z-20 text-center font-[Poppins] text-sm font-normal text-[#FFFFFF]">
          <div className="text-base sm:text-lg">Belum punya akun?</div>
          <Link
            to="/signup"
            className="mt-2 inline-flex items-center justify-center gap-2 w-[335px] h-11.5 text-xl font-bold text-white border-2 border-[#623B1C] bg-[#CAAD8C] rounded-[20px] hover:bg-[#623B1C] hover:text-white transition relative duration-300 hover:scale-105"
          >
            Daftar
            <img
              className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2"
              src={Forwardbutton}
              alt="forwardicon"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
