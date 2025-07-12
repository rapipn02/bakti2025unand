import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import BungaOrnamen from "../../assets/timeline/bunga.svg";
import MotifBawah from "../../assets/timeline/motifbesar.png";

// Data jadwal
const scheduleItems = [
  {
    type: "tabs",
    dates: ["06 AGT", "07 AGT"],
    title: "Ranger Afeksi",
    bgColor: "bg-[#69432A]",
  },
  {
    type: "item",
    date: "09 AGT",
    title: "Gladi Kotor",
    subtitle: "Panitia dan Mentor",
    bgColor: "bg-[#69432A]",
  },
  {
    type: "item",
    date: "10 AGT",
    title: "Gladi Bersih",
    subtitle: "BAKTI 2025",
    bgColor: "bg-[#69432A]",
  },
  {
    type: "item",
    date: "11-12 AGT",
    title: "BAKTI Batch 1",
    subtitle: null,
    bgColor: "bg-[#69432A]",
  },
  {
    type: "item",
    date: "13-14 AGT",
    title: "BAKTI Batch 2",
    subtitle: null,
    bgColor: "bg-[#69432A]",
  },
];

export const Timeline = () => {
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

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section
      id="timeline"
      className="relative min-h-screen flex items-center justify-center bg-[#F6EDDD] p-4 overflow-visible pb-40"
    >
      {/* Ornamen bunga */}
      {bungaPositions.map((pos, index) => (
        <img
          key={index}
          src={BungaOrnamen}
          alt="Ornamen Bunga"
          className="absolute w-12 sm:w-14 md:w-20 z-0 opacity-50"
          style={pos}
        />
      ))}
      {/* Ornamen bawah */}
      <img
        src={MotifBawah}
        alt="Motif Bawah"
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-sm sm:max-w-md md:max-w-2xl z-15"
        data-aos="fade-up"
      />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full">
        {/* Judul */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Titan_One'] text-[#69432A] text-center"
          style={{
            textShadow: `
              -2px -2px 0 white, 2px -2px 0 white,
              -2px 2px 0 white, 2px 2px 0 white,
              0 0 10px rgba(0, 0, 0, 0.4)
            `,
          }}
          data-aos="zoom-in"
        >
          <span>MABA'S</span>
          <br />
          <span>SCHEDULE</span>
        </h1>

        {/* Konten */}
        <div
          className="relative w-full max-w-[20rem] sm:max-w-[22rem] md:max-w-md"
          data-aos="fade-up"
        >
          {/* Header background */}
          <div className="absolute top-0 left-[-1rem] right-[-1rem] md:left-[-3.5rem] md:right-[-3.5rem] h-28 rounded-2xl bg-[#69432A]"></div>

          {/* Kartu utama */}
          <div className="relative bg-white/80 backdrop-blur-sm shadow-xl mt-[50px] pt-6 pb-4 px-4 md:pt-8 md:pb-6 md:px-6 overflow-hidden rounded-2xl">
            {/* Gradasi atas */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#623B1C]/60 to-transparent pointer-events-none"></div>

            {/* Tabs tanggal */}
            <div className="relative mb-14 md:mb-16" data-aos="fade-up">
              <div className="flex justify-center gap-8 md:gap-20">
                {scheduleItems[0].dates.map((date, idx) => (
                  <div key={idx} className="relative">
                    <div className="bg-white shadow-md rounded-md px-2 py-1 sm:px-3 sm:py-2 text-center border-2 border-[#623B1C]">
                      <p className="font-bold text-xs sm:text-sm md:text-base text-[#623B1C]">
                        {date.split(" ")[0]}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-600">
                        {date.split(" ")[1]}
                      </p>
                    </div>
                    <div className="absolute bottom sm:bottom-[-1rem] md:bottom-[-1.2rem] left-1/2 -translate-x-1/2 h-6 sm:h-4 md:h-5 w-[14%] sm:w-[30%] md:w-[12%] bg-[#623B1C]"></div>
                  </div>
                ))}
              </div>
              {/* Garis horizontal */}
              <div className="absolute -bottom-6 sm:-bottom-4 md:-bottom-5 left-1/2 -translate-x-1/2 h-2  w-[25%] sm:w-[60%] md:w-[34%]  bg-[#623B1C]"></div>
              {/* Garis vertikal akhir */}
              <div className="absolute -bottom-14 sm:-bottom-16 md:-bottom-16 left-1/2 -translate-x-1/2  h-10 sm:h-12 md:h-13 w-2 md:w-[3%] bg-[#623B1C]"></div>
            </div>

            {/* Konten jadwal */}
            <div className="space-y-3">
              {scheduleItems.map((item, idx) => {
                if (item.type === "tabs") {
                  return (
                    <div
                      key={idx}
                      className={`${item.bgColor} text-white rounded-lg p-2 sm:p-3 text-center font-['Titan_One']`}
                      data-aos="fade-up"
                    >
                      <p className="text-sm sm:text-base md:text-lg">
                        {item.title}
                      </p>
                    </div>
                  );
                }
                return (
                  <div
                    key={idx}
                    className="relative flex w-full bg-[#FBF5E9] rounded-2xl border shadow-md overflow-hidden"
                    data-aos="fade-up"
                  >
                    <div className="p-2 w-16 sm:w-20 text-center flex-shrink-0 font-['League_Spartan'] flex flex-col justify-center">
                      <p className="font-bold text-lg sm:text-xl md:text-2xl text-[#623B1C]">
                        {item.date.split(" ")[0]}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-[#623B1C]">
                        {item.date.split(" ")[1]}
                      </p>
                    </div>
                    <div
                      className={`${item.bgColor} text-white p-2 sm:p-3 w-full text-center font-['Titan_One'] flex flex-col justify-center`}
                    >
                      <p
                        className="text-xs sm:text-sm md:text-lg text-white/90"
                        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.4)" }}
                      >
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-[10px] sm:text-xs opacity-80 font-['Poppins']">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="absolute top-0 left-[3.8rem] sm:left-[5rem] h-full w-4 sm:w-6 bg-gradient-to-l from-[#623B1C] to-[#F6EDDD] pointer-events-none"></div>
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
