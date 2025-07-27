import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import sigo from "../../assets/maskot/SIGO.png";
import mina from "../../assets/maskot/MINA.png";
import MendungImg1 from "../../assets/maskot/mendung.svg";
import MendungImg2 from "../../assets/maskot/mendung2.svg";
import MendungImg3 from "../../assets/maskot/mendung3.svg";

// Hook mendeteksi ukuran layar
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

// Tombol panah untuk desktop (SIGO)
const SliderArrowDesktopSigo = ({ onClick, left }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-30 bg-[#5E311E]/80 text-white rounded-full w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shadow-lg hover:bg-[#5E311E]/90 hover:scale-105 transition-all cursor-pointer
      ${left ? "left-[-1rem]" : "right-[-46rem]"}`}
    aria-label={left ? "Sebelumnya" : "Selanjutnya"}
  >
    {left ? "\u276E" : "\u276F"}
  </button>
);

// Tombol panah untuk desktop (MINA) - dengan jarak lebih besar dari gambar maskot
const SliderArrowDesktopMina = ({ onClick, left }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-30 bg-[#5E311E]/80 text-white rounded-full w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shadow-lg hover:bg-[#5E311E]/90 hover:scale-105 transition-all cursor-pointer
      ${left ? "left-[-53rem]" : "right-[7rem]"}`}
    aria-label={left ? "Sebelumnya" : "Selanjutnya"}
  >
    {left ? "\u276E" : "\u276F"}
  </button>
);

// Tombol panah untuk mobile
const SliderArrowMobile = ({ onClick, left }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-30 bg-[#5E311E]/80 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-[#5E311E]/90 hover:scale-105 transition-all
      ${left ? "left-2" : "right-2"}`}
    aria-label={left ? "Sebelumnya" : "Selanjutnya"}
  >
    {left ? "\u276E" : "\u276F"}
  </button>
);

// Komponen Awan
const Cloud = ({ src, alt, className, aosAnimation = "fade-in" }) => (
  <img
    src={src}
    alt={alt}
    className={`absolute z-0 ${className}`}
    data-aos={aosAnimation}
  />
);

// Komponen Slider Maskot
const MascotSlider = ({
  containerClassName,
  onChange,
  variant = "desktop",
}) => {
  const maskots = [
    {
      src: sigo,
      alt: "SIGO Maskot",
      title: "SIGO",
      subtitle: "Satria Intelektual Generasi 5.O",
      desc: "SIGO merupakan kesatria yang menyatukan kebijaksanaan adat dan kecanggihan zaman. Deta yang ia kenakan simbol pemimpin yang berpikir tajam dan bertindak. SIGO bukan hanya penggerak tapi juga simbol anak muda yang membawa budaya dan ilmu maju bersama, tanpa kehilangan jati diri.",
    },
    {
      src: mina,
      alt: "MINA Maskot",
      title: "MINA",
      subtitle: "Manifestasi Inovasi dan Adat",
      desc: "MINA merupakan perempuan Minangkabau yang lembut dan visioner.  ia memegang erat tradisi tapi juga mengedepankan teknologi dan ilmu pengetahuan. Mina siap melangkah di garis depan inovasi tanpa melepaskan akar budaya. MINA merupakan representasi perempuan Minang bisa menari di antara adat dan teknologi dengan percaya diri.",
    },
  ];
  const [index, setIndex] = useState(0);

  // Dapatkan konfigurasi untuk ukuran gambar
  const currentConfig =
    MASCOT_CONFIG[maskots[index].title]?.[variant] ||
    MASCOT_CONFIG.SIGO[variant];

  const next = () => {
    const newIndex = (index + 1) % maskots.length;
    setIndex(newIndex);
    onChange && onChange(maskots[newIndex]);
  };

  const prev = () => {
    const newIndex = (index - 1 + maskots.length) % maskots.length;
    setIndex(newIndex);
    onChange && onChange(maskots[newIndex]);
  };

  useEffect(() => {
    onChange && onChange(maskots[index]);
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className={`relative ${containerClassName} flex flex-col items-center`}
      data-aos="zoom-in"
    >
      {variant === "desktop" && (
        <>
          {maskots[index].title === "SIGO" ? (
            <SliderArrowDesktopSigo onClick={prev} left />
          ) : (
            <SliderArrowDesktopMina onClick={prev} left />
          )}
          {maskots[index].title === "SIGO" ? (
            <SliderArrowDesktopSigo onClick={next} />
          ) : (
            <SliderArrowDesktopMina onClick={next} />
          )}
        </>
      )}
      {variant === "mobile" && (
        <>
          <SliderArrowMobile onClick={prev} left />
          <SliderArrowMobile onClick={next} />
        </>
      )}
      <img
        key={index}
        src={maskots[index].src}
        alt={maskots[index].alt}
        className={`w-full h-auto rounded-2xl transition-opacity duration-500 object-contain ${
          variant === "mobile" && currentConfig.maskotSize ? "" : ""
        }`}
        style={{
          maxHeight:
            variant === "desktop"
              ? 600
              : currentConfig.maskotSize
              ? parseInt(currentConfig.maskotSize.match(/\d+/)[0])
              : 300,
        }}
      />
      {variant === "desktop" && (
        <div
          className={`absolute ${
            maskots[index].title === "MINA"
              ? "bottom-[1rem] left-[-10rem] transform -translate-x-1/2"
              : "bottom-[1rem] left-[106%] transform -translate-x-1/2"
          } flex justify-center items-center space-x-3 z-10`}
        >
          {maskots.map((_, i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full bg-[#5E311E] transition-all duration-300"
              style={{ opacity: i === index ? 1 : 0.3 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Komponen Deskripsi
const DescriptionBox = ({
  containerClassName,
  title,
  subtitle,
  titleClassName,
  children,
}) => (
  <div className={containerClassName} data-aos="fade-up">
    <div className="absolute -top-7 sm:-top-8 lg:-top-9 left-1/2 transform -translate-x-1/2 w-max text-center z-20">
      <div
        className={titleClassName}
        style={{
          textShadow: `-2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 2px 2px 0 white, 0 0 10px rgba(0,0,0,0.5)`,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          className="text-2xl font-semibold font-['Poppins'] text-[#5E311E] mt-2 px-4 py-1"
          style={{
            textShadow: `-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white`,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
    <div className="px-5 sm:px-8 pt-26 sm:pt-26 pb-6 sm:pb-8">{children}</div>
  </div>
);

// Helper function untuk mendapatkan konfigurasi maskot
const getMascotConfig = (mascotTitle, variant) => {
  return MASCOT_CONFIG[mascotTitle]?.[variant] || MASCOT_CONFIG.SIGO[variant];
};

// Desktop View
const DesktopView = () => {
  const [maskot, setMaskot] = useState({
    title: "SIGO",
    desc: "SIGO merupakan kesatria yang menyatukan kebijaksanaan adat dan kecanggihan zaman...",
  });

  // GUNAKAN helper function
  const config = getMascotConfig(maskot.title, "desktop");

  // Update AOS setelah perubahan maskot
  useEffect(() => {
    AOS.refresh();
  }, [maskot.title]);

  return (
    <>
      <Cloud
        src={MendungImg1}
        alt="Mendung Kiri"
        className="top-[5rem] left-0 w-[350px]"
        aosAnimation="fade-right"
      />
      <Cloud
        src={MendungImg3}
        alt="Mendung Kanan Pojok"
        className="top-[5rem] right-0 w-[300px] translate-x-22"
        aosAnimation="fade-left"
      />
      <Cloud
        src={MendungImg2}
        alt="Mendung Kanan Tengah"
        className="top-[9rem] right-[1rem] w-[320px]"
        aosAnimation="fade-left"
      />

      <div className="w-full max-w-[1280px] relative h-[600px] mx-auto z-10">
        <MascotSlider
          containerClassName={config.slider}
          onChange={setMaskot}
          variant="desktop"
        />
        <DescriptionBox
          containerClassName={config.description}
          title={maskot.title}
          subtitle={maskot.subtitle}
          titleClassName="text-5xl font-bold font-['Titan_One'] text-[#5E311E] px-6 py-4 tracking-wide"
        >
          <p className="text-[#5E311E] text-justify leading-loose font-['Poppins'] text-lg">
            {maskot.desc}
          </p>
        </DescriptionBox>
      </div>
    </>
  );
};

// Mobile View
const MobileView = () => {
  const [maskot, setMaskot] = useState({
    title: "SIGO",
    desc: "SIGO merupakan kesatria yang menyatukan kebijaksanaan adat dan kecanggihan zaman...",
  });

  // GUNAKAN helper function
  const config = getMascotConfig(maskot.title, "mobile");

  // Update AOS setelah perubahan maskot
  useEffect(() => {
    AOS.refresh();
  }, [maskot.title]);

  return (
    <>
      <Cloud
        src={MendungImg1}
        alt="Mendung Kiri"
        className="top-[5rem] left-[-1rem] w-[200px]"
        aosAnimation="fade-right"
      />
      <Cloud
        src={MendungImg3}
        alt="Mendung Kanan Pojok"
        className="top-[4rem] right-[-1rem] w-[265px] translate-x-22"
        aosAnimation="fade-left"
      />

      <div className="w-full max-w-[600px] flex flex-col items-center gap-2 z-10">
        <MascotSlider
          containerClassName={config.slider}
          onChange={setMaskot}
          variant="mobile"
        />
        <DescriptionBox
          containerClassName={config.description}
          title={maskot.title}
          subtitle={maskot.subtitle}
          titleClassName="text-4xl font-bold font-['Titan_One'] text-[#5E311E] px-5 py-2 tracking-wide"
        >
          <p className="text-[#5E311E] text-justify leading-relaxed font-['Poppins'] text-base">
            {maskot.desc}
          </p>
        </DescriptionBox>
      </div>
    </>
  );
};

// Konfigurasi untuk kedua maskot
const MASCOT_CONFIG = {
  SIGO: {
    desktop: {
      slider:
        "absolute bottom-[-4rem] -left-[2.5rem] w-full max-w-[650px] z-10",
      description:
        "bg-[#FFF6EB] shadow-[10px_10px_0px_0px_#5E311E] rounded-xl border border-[#5E311E] absolute top-[13.5rem] left-[30.5rem] z-0 transform -translate-x-16",
    },
    mobile: {
      slider: "w-full max-w-xs",
      description:
        "bg-[#FFF6EB] shadow-[10px_10px_0px_0px_#5E311E] rounded-xl border border-[#5E311E] w-full",
      maskotSize: "max-h-[400px]",
    },
  },
  MINA: {
    desktop: {
      slider:
        "absolute bottom-[-4rem] right-[-50rem] w-full max-w-[650px] z-10",
      description:
        "bg-[#FFF6EB] shadow-[10px_10px_0px_0px_#5E311E] rounded-xl border border-[#5E311E] absolute top-[13.5rem] left-[12rem] z-0 w-[800px]",
    },
    mobile: {
      slider: "w-full max-w-sm", // Ukuran MINA mobile - bisa diatur
      description:
        "bg-[#FFF6EB] shadow-[10px_10px_0px_0px_#5E311E] rounded-xl border border-[#5E311E] w-full",
      maskotSize: "max-h-[400px]", // Ukuran gambar MINA mobile
    },
  },
};

export const Mascot = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section
      id="maskot"
      className="relative min-h-screen w-full pt-20 pb-16 px-4 flex items-center justify-center overflow-x-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #C3851D, #CAAD8C, #F6EDDD)",
      }}
    >
      {isDesktop ? <DesktopView /> : <MobileView />}
    </section>
  );
};

export default Mascot;
