import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import MotifKiri from "../../assets/task/mendung.svg";
import MotifKanan from "../../assets/task/mendung kanan.svg";
import BungaOrnamen from "../../assets/timeline/bunga.svg";

const bungaPositions = [
  { top: "2%", left: "3%" },
  { top: "2%", right: "3%" },
  { top: "12%", right: "10%" },
  { top: "60%", left: "5%" },
  { top: "80%", right: "5%" },
  { top: "80%", left: "40%" },
  { top: "50%", right: "2%" },
];

export const Task = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section
      id="task"
      className="relative min-h-screen flex items-center justify-center bg-[#F6EDDD] p-4 overflow-visible -mt-0 overflow-x-hidden"
    >
      {/* Bunga Ornamen */}
      {bungaPositions.map((pos, index) => (
        <img
          key={index}
          src={BungaOrnamen}
          alt="Bunga Ornamen"
          className="absolute w-20 lg:w-24 opacity-70"
          style={{ ...pos }}
          data-aos="fade"
        />
      ))}

      {/* MOBILE */}
      <div className="block lg:hidden w-full" data-aos="fade-up">
        <div className="relative w-full max-w-xs mx-auto">
          {/* Ornamen Mobile */}
          <img
            src={MotifKiri}
            alt="Ornamen Kiri"
            className="absolute -top-4 -left-12 w-28 z-0 opacity-80"
            data-aos="fade-right"
          />
          <img
            src={MotifKanan}
            alt="Ornamen Kanan"
            className="absolute -bottom-4 -right-12 w-28 z-0 opacity-80"
            data-aos="fade-left"
          />

          {/* Konten Mobile */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Judul Mobile */}
            <div className="relative z-20" data-aos="zoom-in">
              <div className="absolute inset-x-[-1rem] top-1/2 -translate-y-1/2 h-10 z-[-1]"></div>
              <h1
                className="font-['Titan_One'] text-2xl px-4 text-[#623B1C]"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
              >
                BAKTI CHALLENGE
              </h1>
            </div>

            {/* Kartu Depan Mobile */}
            <div
              className="relative z-10 bg-[#FBF3E6] border-2 border-[#D9BFA2] rounded-2xl shadow-lg p-6 pt-8 text-center w-full flex flex-col items-center -mt-5"
              data-aos="fade-up"
            >
              <p className="text-sm font-semibold text-[#5E4A3A] font-['Poppins']">
                Are you ready for BAKTI CHALLENGE ?
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[#5E4A3A] font-['Poppins']">
                Ada beberapa tugas yang harus kamu selesaikan sebelum kamu
                mengikuti kegiatan BAKTI UNAND 2025. Setiap mahasiswa baru
                Universitas Andalas tahun 2025 harus menyelesaikan beberapa
                tugas yang sudah kami siapkan untuk mengenalkan kehidupan kampus
                dan menunjukkan keterampilan diri kamu.
              </p>
              <button className="mt-6 px-10 py-2.5 bg-[#623B1C] text-white font-bold font-['Poppins'] rounded-2xl shadow-md border-2 border-white/50 hover:scale-105 transition-transform duration-300">
                Your Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block w-full" data-aos="fade-up">
        {/* Ornamen Latar Belakang Desktop */}
        <img
          src={MotifKiri}
          alt="Ornamen Kanan Bawah"
          className="absolute -top-[2.5rem] -translate-y-1/2 -left-4 w-92 z-0"
          data-aos="fade-right"
        />
        <img
          src={MotifKanan}
          alt="Ornamen Atas"
          className="absolute bottom-0 right-0 translate-x-32 w-[500px] z-0 -scale-x-100"
          data-aos="fade-left"
        />

        {/* Konten Utama Desktop */}
        <div className="relative z-10 grid place-items-center w-full max-w-4xl mx-auto">
          {/* Lapisan Belakang Kartu */}
          <div
            className="bg-[#69432A] w-10/12 h-56 rounded-2xl col-start-1 row-start-1"
            data-aos="zoom-in"
          ></div>

          {/* Kartu Depan */}
          <div
            className="bg-[#FBF3E6] border border-[#D9BFA2] rounded-2xl shadow-lg p-8 text-center w-full max-w-xl col-start-1 row-start-1 flex flex-col items-center"
            data-aos="fade-up"
          >
            {/* Judul */}
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 text-[#69432A] font-['Titan_One'] text-3xl"
              style={{
                textShadow:
                  "-2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 2px 2px 0 white, 0 0 10px rgba(0,0,0,0.5), 0 0 15px rgba(0,0,0,0.4)",
              }}
              data-aos="zoom-in"
            >
              BAKTI CHALLENGE
            </div>

            {/* Deskripsi */}
            <p className="mt-6 text-lg text-[#5E4A3A] font-['Poppins'] font-normal">
              Are you ready for BAKTI CHALLENGE ?
            </p>
            <p className="mt-4 text-base font-normal text-[#5E4A3A] font-['Poppins'] max-w-md">
              Ada beberapa tugas yang harus kamu selesaikan sebelum kamu
              mengikuti kegiatan BAKTI UNAND 2025. Setiap mahasiswa baru
              Universitas Andalas tahun 2025 harus menyelesaikan beberapa tugas
              yang sudah kami siapkan untuk mengenalkan kehidupan kampus dan
              menunjukkan keterampilan diri kamu.
            </p>

            {/* Tombol */}
            <a href="/pengumpulantugas">
              <button className="mt-8 px-10 py-3 bg-[#623B1C] text-white font-bold font-['Poppins'] rounded-xl shadow-md border transition duration-300 hover:scale-105 cursor-pointer">
                Your Task
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Task;
