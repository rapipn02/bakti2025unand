import React from "react";
import Navbar from "../../component/Navbar"; // Asumsi path Navbar Anda sudah benar
import MotifBawah from "../../assets/timeline/motifbesar.png";
import ikonfile from "../../assets/kumpultugas/kumpultugas.svg";

const tasksData = [
  {
    id: 1,
    title: "Tugas 1",
    deadline: "Deadline 01 Agustus 2025 | 07:00",
  },
  {
    id: 2,
    title: "Tugas 2",
    deadline: "Deadline 02 Agustus 2025 | 07:00",
  },
  {
    id: 3,
    title: "Tugas 3",
    deadline: "Deadline 03 Agustus 2025 | 07:00",
  },
];

export const Pengumpulantugas = () => {
  return (
    <div>
      <Navbar />
      {/* Container Halaman Utama */}
      <div className="bg-[#fcf8f0] min-h-screen font-sans flex justify-center items-center ">
        {/* Konten Utama Tugas */}
        <main className="relative bg-[#f9f4e8] w-full max-w-7xl p-10 pt-32 rounded-2xl shadow-lg border-2 border-[#623B1C] overflow-visible">
          {/* Judul */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 text-center w-full px-4">
            <div className="bg-[#6d4c41] text-white inline-block px-10 py-4 rounded-2xl w-full max-w-xl">
              <div className="flex flex-col items-center justify-start gap-1">
                <h1 className="font-['Titan_One'] text-3xl md:text-4xl font-normal leading-tight">
                  TUGAS BAKTI
                </h1>
                <p className="text-sm md:text-base font-bold font-[Poppins] -mt-1">
                  Kumpulkan tugas tepat waktu!
                </p>
              </div>
            </div>
          </div>

          {/* Daftar Tugas */}
          <div className="flex flex-col gap-5 relative z-10">
            {tasksData.map((task) => (
              <div
                key={task.id}
                className="bg-[#6d4c41] text-white flex justify-between items-center px-6 py-5 rounded-2xl transition-transform duration-200 hover:-translate-y-1"
              >
                {/* Info Tugas (Ikon, Judul) */}
                <div className="flex items-center gap-5">
                  <img src={ikonfile} alt="Ikon Tugas" className="w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-bold font-[poppins]">
                      {task.title}
                    </h3>
                  </div>
                </div>

                {/* Kanan: Deadline + Tombol */}
                <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4 text-right">
                  <p className="text-sm text-[#d7ccc8] font-normal font-[poppins]">
                    {task.deadline}
                  </p>
                  <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold font-[poppins] text-sm transition-colors duration-300 hover:bg-gray-300 cursor-pointer">
                    Lihat Tugas
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Gambar Dekoratif di Bagian Bawah */}
          <img
            src={MotifBawah}
            alt="Decorative Pattern"
            className="absolute -top-[0rem] left-1/2 -translate-x-1/2 w-4/5 max-w-auto opacity-40 z-0"
          />
        </main>
      </div>
    </div>
  );
};

export default Pengumpulantugas;
