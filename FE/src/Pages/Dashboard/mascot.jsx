import React, { useState, useEffect } from "react";
import DilloImage from "../../assets/maskot/Dillo.svg";
import MendungImg1 from "../../assets/maskot/mendung.svg";
import MendungImg2 from "../../assets/maskot/mendung2.svg";
import MendungImg3 from "../../assets/maskot/mendung3.svg";

// Hook untuk mendeteksi ukuran layar
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

// === KOMPONEN-KOMPONEN KECIL YANG BISA DIATUR ===

// Komponen Awan: Ukuran dan posisi diatur penuh oleh props
const Cloud = ({ src, alt, className }) => {
  return <img src={src} alt={alt} className={`absolute z-0 ${className}`} />;
};

// Komponen Gambar Maskot: Ukuran diatur oleh props
const MascotFigure = ({ containerClassName }) => {
  return (
    <div className={containerClassName}>
      <img src={DilloImage} alt="Dillo Maskot" className="w-full h-auto" />
    </div>
  );
};

// Komponen Kotak Deskripsi: Ukuran dan style diatur oleh props
const DescriptionBox = ({
  containerClassName,
  title,
  titleClassName,
  children,
}) => {
  return (
    <div className={containerClassName}>
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
};

// === KOMPONEN VIEW (BERTINDAK SEBAGAI SUTRADARA) ===

// Tampilan Desktop: Mengatur semua ukuran untuk Awan, Maskot, dan Deskripsi
const DesktopView = () => {
  return (
    <>
      {/* Awan-awan dengan ukuran dan posisi khusus Desktop */}
      <Cloud
        src={MendungImg1}
        alt="Mendung Kiri"
        className="top-[5rem] left-0 w-[250px]"
      />
      <Cloud
        src={MendungImg3}
        alt="Mendung Kanan Pojok"
        className="top-[5rem] right-0 w-[280px] translate-x-22"
      />
      <Cloud
        src={MendungImg2}
        alt="Mendung Kanan Tengah"
        className="top-[9rem] right-[1rem] w-[300px]"
      />

      {/* Konten Utama Desktop */}
      <div className="w-full max-w-[1280px] flex justify-center items-center gap-8 z-10">
        <MascotFigure containerClassName="w-full max-w-[500px]" />
        <DescriptionBox
          containerClassName="bg-[#FFF6EB] shadow-[10px_10px_0px_0px_#5E311E] rounded-xl border border-[#5E311E] w-full max-w-[650px] mt-[7.5rem] left-[6.5rem]"
          title="MASKOT BARU"
          titleClassName="text-4xl font-bold font-['Titan_One'] text-[#5E311E] px-6 py-2 tracking-wide mt-[18.5rem] ml-[35rem]"
        >
          <p className="text-[#5E311E] text-justify leading-loose font-['Poppins'] text-lg">
            Dillo adalah seekor buaya yang memiliki semangat tinggi dalam
            bertualang mencari pengalaman. Dillo dapat beradaptasi dengan cepat
            di lingkungan baru dan berani dalam menghadapi setiap rintangan.
            Kemampuan bertahan hidup Dillo sudah tidak diragukan lagi. Selain
            itu, Dillo juga memiliki kemampuan komunikasi yang baik dan
            bijaksana dalam mengambil keputusan.
          </p>
        </DescriptionBox>
      </div>
    </>
  );
};

// Tampilan Mobile: Mengatur semua ukuran untuk Awan, Maskot, dan Deskripsi
const MobileView = () => {
  return (
    <>
      {/* Awan-awan dengan ukuran dan posisi khusus Mobile */}
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

      {/* Konten Utama Mobile */}
      <div className="w-full max-w-[600px] flex flex-col items-center gap-4 z-10">
        <MascotFigure containerClassName="w-full max-w-xs mt-[2rem]" />
        <DescriptionBox
          containerClassName="bg-[#FFF6EB] shadow-[10px_10px_0px_0px_#5E311E] rounded-xl border border-[#5E311E] w-full top-0"
          title="MASKOT BARU"
          titleClassName="text-2xl font-bold font-['Titan_One'] text-[#5E311E] px-5 py-2 tracking-wide mt-[28rem]"
        >
          <p className="text-[#5E311E] text-justify leading-relaxed font-['Poppins'] text-base">
            Dillo adalah seekor buaya yang memiliki semangat tinggi dalam
            bertualang mencari pengalaman. Dillo dapat beradaptasi dengan cepat
            di lingkungan baru dan berani dalam menghadapi setiap rintangan.
            Kemampuan bertahan hidup Dillo sudah tidak diragukan lagi. Selain
            itu, Dillo juga memiliki kemampuan komunikasi yang baik dan
            bijaksana dalam mengambil keputusan.
          </p>
        </DescriptionBox>
      </div>
    </>
  );
};

// === KOMPONEN UTAMA (SAKLAR YANG SANGAT BERSIH) ===

export const Mascot = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <section
      id="maskot"
      className="relative min-h-screen w-full pt-20 pb-16 px-4 flex items-center justify-center overflow-x-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, #C3851D, #CAAD8C, #F6EDDD)",
      }}
    >
      {/* Komponen utama sekarang hanya menjadi saklar, sangat bersih. */}
      {isDesktop ? <DesktopView /> : <MobileView />}
    </section>
  );
};

export default Mascot;
