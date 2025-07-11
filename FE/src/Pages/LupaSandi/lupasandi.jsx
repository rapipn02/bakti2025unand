import React, { useState } from "react";
import backgroundbakti from "../../assets/auth/BAKTIUNAND2025.svg";
import logobakti from "../../assets/auth/Bakti.svg";

const Lupasandi = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      // Request verification code (step 1)
      const response = await fetch(
        `http://localhost:4000/auth/generate-code?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );
      const result = await response.json();
      if (response.ok && result.status === 200) {
        setSuccessMsg("Kode verifikasi telah dikirim ke email Anda.");
      } else {
        setErrorMsg(result.message || "Gagal mengirim kode verifikasi.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan. Silakan coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${backgroundbakti})` }}
      ></div>

      {/* ==== Mobile Layout ==== */}
      <div className=" md:hidden absolute inset-0 z-10 backdrop-blur-md flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-[#fefaf1]/90 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <img src={logobakti} alt="logo" className="w-10 h-10 mr-2" />
            <span
              className="text-base font-bold text-[#623B1C] font-['Titan_One']"
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
              BAKTI UNAND 2025
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="email"
              className="block text-sm text-[#623B1C] mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Masukkan Email"
              className="w-full px-4 py-2 mb-5 rounded-xl border border-[#a67c52] bg-white/90 text-[#623B1C] placeholder:text-[#c0a68a] focus:outline-none focus:ring-2 focus:ring-[#a67c52]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full py-2 text-white font-bold bg-[#a67c52] rounded-xl hover:bg-[#623B1C] transition duration-300"
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Submit"}
            </button>
            {successMsg && (
              <p className="text-green-600 text-sm mt-3 text-center">{successMsg}</p>
            )}
            {errorMsg && (
              <p className="text-red-600 text-sm mt-3 text-center">{errorMsg}</p>
            )}
          </form>
        </div>
      </div>

      {/* ==== Desktop Layout ==== */}
      <div className="hidden md:flex absolute inset-0 z-10 items-center justify-center px-6">
        <div className="w-full max-w-md bg-[#fefaf1]/90 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <img src={logobakti} alt="logo" className="w-12 h-12 mr-3" />
            <span
              className="text-xl font-bold text-[#623B1C] font-['Titan_One']"
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
              BAKTI UNAND 2025
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="email"
              className="block text-sm text-[#623B1C] mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Masukkan Email"
              className="w-full px-4 py-2 mb-5 rounded-xl border border-[#a67c52] bg-white text-[#623B1C] placeholder:text-[#c0a68a] focus:outline-none focus:ring-2 focus:ring-[#a67c52]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full py-2 text-white font-bold bg-[#a67c52] rounded-xl hover:bg-[#623B1C] transition duration-300 hover:scale-105"
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Submit"}
            </button>
            {successMsg && (
              <p className="text-green-600 text-sm mt-3 text-center">{successMsg}</p>
            )}
            {errorMsg && (
              <p className="text-red-600 text-sm mt-3 text-center">{errorMsg}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Lupasandi;