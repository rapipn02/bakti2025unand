import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import DilloImage from "../../assets/maskot/dillonew.png";
import Ronand from "../../assets/maskot/ronand.svg";
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

// Tombol panah untuk desktop
const SliderArrowDesktop = ({ onClick, left }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-30 bg-[#5E311E]/80 text-white rounded-full w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center shadow-lg hover:bg-[#5E311E]/90 hover:scale-105 transition-all cursor-pointer
      ${left ? "left-[-1rem]" : "right-[-46rem]"}`}
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
const Cloud = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={`absolute z-0 ${className}`} />
);

// Komponen Slider Maskot
const MascotSlider = ({
  containerClassName,
  onChange,
  variant = "desktop",
}) => {
  const maskots = [
    {
      src: DilloImage,
      alt: "Dillo Maskot",
      title: "DILLO",
      desc: "Dillo adalah seekor buaya yang memiliki semangat tinggi dalam bertualang mencari pengalaman. Dillo dapat beradaptasi dengan cepat di lingkungan baru dan berani menghadapi setiap rintangan. Kemampuan bertahan hidup Dillo sudah tidak diragukan lagi. Selain itu, Dillo juga memiliki kemampuan komunikasi yang baik dan bijaksana dalam mengambil keputusan.",
    },
    {
      src: Ronand,
      alt: "Ronand Maskot",
      title: "RONAND",
      desc: "RONAND merupakan singkatan dari “ROBOT UNAND” yang memiliki berbagai simbol dengan makna mendalam. Mahkota melambangkan kejayaan, sedangkan tanduk menggambarkan ketangguhan dalam menghadapi tantangan. Tangan besi melambangkan kekuatan dan pertahanan dalam perjuangan, dan sayap melambangkan kebebasan untuk terus berkembang dalam mencapai kejayaan.",
    },
  ];
  const [index, setIndex] = useState(0);

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
      {variant === "desktop" ? (
        <>
          <SliderArrowDesktop onClick={prev} left />
          <SliderArrowDesktop onClick={next} />
        </>
      ) : (
        <>
          <SliderArrowMobile onClick={prev} left />
          <SliderArrowMobile onClick={next} />
        </>
      )}
      <img
        key={index}
        src={maskots[index].src}
        alt={maskots[index].alt}
        className="w-full h-auto rounded-2xl transition-opacity duration-500 object-contain"
        style={{ maxHeight: 600 }}
      />
      <div className="flex mt-0 space-x-2 z-10">
        {maskots.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-[#5E311E]" : "bg-[#5E311E]/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Komponen Deskripsi
const DescriptionBox = ({
  containerClassName,
  title,
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
    </div>
    <div className="px-5 sm:px-8 pt-12 sm:pt-14 pb-6 sm:pb-8">{children}</div>
  </div>
);

// Desktop View
const DesktopView = () => {
  const [maskot, setMaskot] = useState({
    title: "DILLO",
    desc: "Dillo adalah seekor buaya yang memiliki semangat tinggi dalam bertualang mencari pengalaman. Dillo dapat beradaptasi dengan cepat di lingkungan baru dan berani menghadapi setiap rintangan. Kemampuan bertahan hidup Dillo sudah tidak diragukan lagi. Selain itu, Dillo juga memiliki kemampuan komunikasi yang baik dan bijaksana dalam mengambil keputusan.",
  });

  return (
    <>
      <Cloud
        src={MendungImg1}
        alt="Mendung Kiri"
        className="top-[5rem] left-0 w-[350px]"
      />
      <Cloud
        src={MendungImg3}
        alt="Mendung Kanan Pojok"
        className="top-[5rem] right-0 w-[300px] translate-x-22"
      />
      <Cloud
        src={MendungImg2}
        alt="Mendung Kanan Tengah"
        className="top-[9rem] right-[1rem] w-[320px]"
      />

      <div className="w-full max-w-[1280px] relative h-[600px] mx-auto z-10">
        <MascotSlider
          containerClassName="absolute bottom-[-4rem] -left-[2.5rem] w-full max-w-[650px] z-10"
          onChange={setMaskot}
          variant="desktop"
        />
        <DescriptionBox
          containerClassName="bg-[#FFF6EB] shadow-[10px_10px_0px_0px_#5E311E] rounded-xl border border-[#5E311E] absolute top-[13.5rem] left-[30.5rem] z-0 transform -translate-x-16"
          title={maskot.title}
          titleClassName="text-4xl font-bold font-['Titan_One'] text-[#5E311E] px-6 py-4 tracking-wide"
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
    title: "DILLO",
    desc: "Dillo adalah seekor buaya yang memiliki semangat tinggi dalam bertualang mencari pengalaman. Dillo dapat beradaptasi dengan cepat di lingkungan baru dan berani menghadapi setiap rintangan. Kemampuan bertahan hidup Dillo sudah tidak diragukan lagi. Selain itu, Dillo juga memiliki kemampuan komunikasi yang baik dan bijaksana dalam mengambil keputusan.",
  });

  return (
    <>
      <Cloud
        src={MendungImg1}
        alt="Mendung Kiri"
        className="top-[5rem] left-[-1rem] w-[200px]"
      />
      <Cloud
        src={MendungImg3}
        alt="Mendung Kanan Pojok"
        className="top-[4rem] right-[-1rem] w-[265px] translate-x-22"
      />

      <div className="w-full max-w-[600px] flex flex-col items-center gap-4 z-10">
        <MascotSlider
          containerClassName="w-full max-w-xs mt-[2rem]"
          onChange={setMaskot}
          variant="mobile"
        />
        <DescriptionBox
          containerClassName="bg-[#FFF6EB] shadow-[10px_10px_0px_0px_#5E311E] rounded-xl border border-[#5E311E] w-full top-0"
          title={maskot.title}
          titleClassName="text-2xl font-bold font-['Titan_One'] text-[#5E311E] px-5 py-2 tracking-wide mt-[28rem]"
        >
          <p className="text-[#5E311E] text-justify leading-relaxed font-['Poppins'] text-base">
            {maskot.desc}
          </p>
        </DescriptionBox>
      </div>
    </>
  );
};

// Komponen Utama
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
