import React, { useState, useEffect } from "react";

// Import semua aset gambar
import RnB from "../../assets/gallery/rnb.png";
import MIT from "../../assets/gallery/mit.jpg";
import MIT1 from "../../assets/gallery/mit1.jpg";
import MIT2 from "../../assets/gallery/mit2.jpg";
import MIT3 from "../../assets/gallery/mit3.jpg";
import MIT4 from "../../assets/gallery/mit4.jpg";
import MIT5 from "../../assets/gallery/mit5.jpg";
import INTI from "../../assets/gallery/Inti.jpg";
import COFAS from "../../assets/gallery/cofas.jpg";
import ACARA from "../../assets/gallery/acara.jpg";
import KESTARI from "../../assets/gallery/kestari.jpg";
import KONSUM from "../../assets/gallery/konsumsi.jpg";
import PERLE from "../../assets/gallery/perle.jpg";
import MNG from "../../assets/gallery/mng.jpg";
import BungaOrnamen from "../../assets/timeline/bunga.svg";
import Title from "../../assets/gallery/title.svg";

const bungaPositions = [
  { top: "2%", left: "3%" },
  { top: "2%", right: "3%" },
  { top: "12%", left: "10%" },
  { top: "12%", right: "10%" },
  { top: "80%", left: "5%" },
  { top: "80%", right: "5%" },
  { top: "90%", left: "40%" },
  { top: "50%", right: "2%" },
];

// Data untuk galeri
const galleryImages = [
  {
    id: 1,
    src: INTI,
    alt: "Inti",
    gridClass: "md:col-start-2 md:col-span-2 md:row-start-1 md:row-span-2",
  },
  {
    id: 2,
    src: ACARA,
    alt: "Acara",
    gridClass: "md:col-start-1 md:col-span-2 md:row-start-3 md:row-span-2",
  },
  {
    id: 3,
    src: RnB,
    alt: "RnB",
    gridClass: "md:col-start-3 md:col-span-2 md:row-start-3 md:row-span-2",
  },
  {
    id: 4,
    src: KESTARI,
    alt: "Kestari",
    gridClass: "md:col-start-1 md:col-span-1 md:row-start-5 md:row-span-2",
  },
  {
    id: 5,
    src: MIT,
    alt: "MIT",
    gridClass: "md:col-start-2 md:col-span-2 md:row-start-5 md:row-span-2",
    slides: [MIT, MIT1, MIT2, MIT3, MIT4, MIT5],
  },
  {
    id: 6,
    src: COFAS,
    alt: "Cofas",
    gridClass: "md:col-start-4 md:col-span-1 md:row-start-5 md:row-span-2",
  },
  {
    id: 7,
    src: KONSUM,
    alt: "Konsumsi",
    gridClass: "md:col-start-1 md:col-span-2 md:row-start-7 md:row-span-2",
  },
  {
    id: 8,
    src: PERLE,
    alt: "Perlengkapan",
    gridClass: "md:col-start-3 md:col-span-2 md:row-start-7 md:row-span-2",
  },
  {
    id: 9,
    src: MNG,
    alt: "MNG",
    gridClass: "md:col-start-2 md:col-span-2 md:row-start-9 md:row-span-2",
  },
];

// Komponen slideshow dengan fade smooth
const SlideshowImage = ({ slides }) => {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered) return;
    const interval = setInterval(() => {
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 1000); // Lebih lama biar smooth
    return () => clearInterval(interval);
  }, [hovered, index, slides.length]);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setIndex(0);
        setPrevIndex(0);
      }}
    >
      {/* Gambar sebelumnya */}
      <img
        src={slides[prevIndex]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500"
        style={{
          objectPosition:
            slides[prevIndex] === MIT4
              ? "center 42%"
              : slides[prevIndex] === MIT
              ? "center 65%"
              : slides[prevIndex] === MIT1
              ? "center 60%"
              : slides[prevIndex] === MIT2
              ? "center 60%"
              : slides[prevIndex] === MIT3
              ? "center 52%"
              : "center",
        }}
      />
      {/* Gambar sekarang */}
      <img
        src={slides[index]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          objectPosition:
            slides[index] === MIT4
              ? "center 42%"
              : slides[index] === MIT
              ? "center 65%"
              : slides[index] === MIT1
              ? "center 60%"
              : slides[index] === MIT2
              ? "center 60%"
              : slides[index] === MIT3
              ? "center 50%"
              : slides[index] === MIT5
              ? "center 62%"
              : "center",
        }}
      />
    </div>
  );
};

export const Gallery = () => {
  return (
    <section
      id="gallery"
      className="min-h-screen w-full bg-[#F6EDDD] pt-20 pb-16 px-5 md:px-10 cursor-pointer"
      style={{ position: "relative" }}
    >
      {/* Render bunga ornamen */}
      {bungaPositions.map((pos, idx) => (
        <img
          key={idx}
          src={BungaOrnamen}
          alt=""
          style={{
            position: "absolute",
            width: 120,
            height: 120,
            opacity: 0.4,
            pointerEvents: "none",
            ...pos,
            zIndex: 1,
          }}
        />
      ))}

      {/* Title di atas foto inti */}
      <div className="flex justify-center mb-3">
        <img
          src={Title}
          alt="BAKTI UNAND 2025 PRESENT"
          style={{ maxWidth: 600, width: "100%" }}
        />
      </div>

      <div className="flex flex-col gap-10 md:grid md:grid-cols-4 md:grid-rows-[repeat(10,10vw)] md:gap-4 max-w-7xl mx-auto">
        {galleryImages.map((image) => (
          <div
            key={image.id}
            className={`
              relative overflow-hidden rounded-2xl shadow-xl 
              transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-2xl
              h-[250px] md:h-auto ${image.gridClass} group
            `}
            style={
              image.alt === "MIT"
                ? { position: "relative", minHeight: "100%" }
                : undefined
            }
          >
            {image.slides ? (
              <SlideshowImage slides={image.slides} />
            ) : (
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                style={
                  image.alt === "MIT"
                    ? { objectPosition: "center 65%" }
                    : image.alt === "Konsumsi"
                    ? { objectPosition: "center 65%" }
                    : image.alt === "Acara"
                    ? { objectPosition: "center 100%" } // Atur sesuai kebutuhan
                    : image.alt === "Perlengkapan"
                    ? { objectPosition: "center 85%" } // Atur sesuai kebutuhan
                    : image.alt === "Inti"
                    ? { objectPosition: "center 60%" } // Atur sesuai kebutuhan
                    : image.alt === "MNG"
                    ? { objectPosition: "center 80%" } // Atur sesuai kebutuhan
                    : undefined
                }
              />
            )}

            <div
              className="
                absolute inset-x-0 bottom-0 w-full p-3 text-center text-[#F6EDDD] font-['Titan_One'] text-ultrabold bg-black/60
                opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-300 ease-in-out
              "
            >
              {image.alt}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
