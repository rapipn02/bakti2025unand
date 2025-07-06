import React from "react";
// Pastikan path aset gambar sudah benar
import BungaOrnamen from "../../assets/timeline/bunga.svg";
import MotifBawah from "../../assets/timeline/motifbesar.png";

// Data untuk jadwal, disesuaikan dengan gambar
const scheduleItems = [
  {
    type: "tabs",
    dates: ["23 JUL", "27 JUL", "28 JUL"],
    title: "Ranger Afeksi",
    bgColor: "bg-[#69432A]",
  },
  {
    type: "item",
    date: "03 AGT",
    title: "Gladi Kotor",
    subtitle: "Panitia dan Mentor",
    bgColor: "bg-[#69432A]",
  },
  {
    type: "item",
    date: "04 AGT",
    title: "Glado Bersih",
    subtitle: "BAKTI 2025",
    bgColor: "bg-[#69432A]",
  },
  {
    type: "item",
    date: "05-06 AGT",
    title: "BAKTI Batch 1",
    subtitle: null,
    bgColor: "bg-[#69432A]",
  },
  {
    type: "item",
    date: "07-08 AGT",
    title: "BAKTI Batch 2",
    subtitle: null,
    bgColor: "bg-[#69432A]",
  },
];

export const Timeline = () => {
  // Posisi untuk ornamen bunga agar tidak ditulis berulang
  const bungaPositions = [
    { top: "15%", left: "10%" },
    { top: "35%", left: "5%" },
    { top: "55%", left: "12%" },
    { top: "75%", left: "8%" },
    { top: "15%", right: "10%" },
    { top: "35%", right: "5%" },
    { top: "55%", right: "12%" },
    { top: "75%", right: "8%" },
  ];

  return (
    <section
      id="timeline"
      className="relative min-h-screen flex items-center justify-center bg-[#F6EDDD] p-4 overflow-hidden"
    >
      {/* Ornamen Latar Belakang */}
      {bungaPositions.map((pos, index) => (
        <img
          key={index}
          src={BungaOrnamen}
          alt="Ornamen Bunga"
          className="absolute w-16 md:w-20 z-0 opacity-50"
          style={pos}
        />
      ))}
      <img
        src={MotifBawah}
        alt="Ornamen Bawah"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg md:max-w-2xl z-0"
      />

      {/* Konten Utama */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full">
        {/* Judul Utama */}
        <h1
          className="text-4xl md:text-5xl font-bold font-['Titan_One'] text-[#69432A]"
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
          <span className="block text-center">MABA'S</span>
          <span className="block">SCHEDULE</span>
        </h1>

        {/* Kartu Jadwal */}
        <div className="relative w-full max-w-md md:max-w-lg">
          {/* Lapisan Belakang Kartu (Efek Bayangan/Offset) */}
          <div className="absolute inset-0 bg-[#69432A] rounded-2xl transform translate-x-1 translate-y-1"></div>

          {/* Kartu Depan */}
          <div className="relative bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl pt-16 pb-6 px-6">
            <div className="space-y-3">
              {scheduleItems.map((item, index) => {
                if (item.type === "tabs") {
                  return (
                    <div key={index} className="relative">
                      {/* Tabs Tanggal */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
                        {item.dates.map((date, dateIndex) => (
                          <div
                            key={dateIndex}
                            className="bg-transparent shadow-lg rounded-md px-3 py-2 text-center border-2 border-[#69432A] "
                          >
                            <p className="font-bold text-sm md:text-base text-[#69432A]">
                              {date.split(" ")[0]}
                            </p>
                            <p className="text-xs text-gray-600">
                              {date.split(" ")[1]}
                            </p>
                          </div>
                        ))}
                      </div>
                      {/* Deskripsi Event untuk Tabs */}
                      <div
                        className={`${item.bgColor} text-white rounded-lg p-3 text-center font-['Titan_One']`}
                      >
                        <p className="font-normal text-base md:text-lg">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  );
                }
                // Item Jadwal Biasa
                return (
                  <div key={index} className="flex items-center gap-3 md:gap-4">
                    <div className="bg-white shadow rounded-md p-2 w-20 text-center flex-shrink-0 font-['League_Spartan']">
                      <p className="font-bold text-sm md:text-base text-[#69432A]">
                        {item.date.split(" ")[0]}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.date.split(" ")[1]}
                      </p>
                    </div>
                    <div
                      className={`${item.bgColor} text-white rounded-lg p-3 w-full text-center font-['Titan_One']`}
                    >
                      <p className="font-normal text-base md:text-lg">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-xs opacity-80 font-['Poppins']">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
