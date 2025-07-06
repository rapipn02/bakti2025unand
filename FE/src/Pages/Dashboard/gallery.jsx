import React from "react";

// Import semua aset gambar Anda
import RnB from "../../assets/gallery/rnb.png";
import MIT from "../../assets/gallery/mit.jpg";
import INTI from "../../assets/gallery/Inti.jpg";
import COFAS from "../../assets/gallery/cofas.jpg";
import ACARA from "../../assets/gallery/acara.jpg";
import KESTARI from "../../assets/gallery/kestari.jpg";
import KONSUM from "../../assets/gallery/konsumsi.jpg";
import PERLE from "../../assets/gallery/perle.jpg";
import MNG from "../../assets/gallery/mng.jpg";

// Data untuk galeri, termasuk kelas Tailwind untuk penempatan di grid desktop
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

export const Gallery = () => {
  return (
    // Menggunakan <section> dari permintaan Anda dengan kelas yang disesuaikan
    <section
      id="gallery"
      className="min-h-screen w-full bg-[#F6EDDD] pt-20 pb-16 px-5 md:px-10 cursor-pointer"
    >
      {/* Kontainer Grid Responsif */}
      <div className="flex flex-col gap-10 md:grid md:grid-cols-4 md:grid-rows-[repeat(10,10vw)] md:gap-4 max-w-7xl mx-auto">
        {galleryImages.map((image) => (
          // Setiap item galeri
          <div
            key={image.id}
            className={`
              relative overflow-hidden rounded-2xl shadow-xl 
              transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-2xl
              h-[250px] md:h-auto ${image.gridClass} group
            `}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {/* Overlay yang muncul saat hover */}
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
