import React from "react";
import BackgroundImage from "../../assets/auth/background.svg";
import HomeMobile from "../../assets/auth/baktiunandmobile.svg";
import Awan from "../../assets/auth/awanfull.svg";
import Navbar from "../../component/Navbar";
import About from "./about";
import Mascot from "./mascot";
import Timeline from "./timeline";
import Task from "./task";
import Gallery from "./gallery";
import Footer from "../../component/footer";

const Home = () => {
  return (
    <div className="pt-0">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-screen w-full overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center hidden lg:block"
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        />
        <div
          className="absolute inset-0 z-0 bg-cover bg-center block lg:hidden"
          style={{ backgroundImage: `url(${HomeMobile})` }}
        />

        {/* Desktop Heading */}
        <div
          className="hidden lg:block relative w-full max-w-4xl mx-auto mt-6 text-[#623B1C] font-['Carena'] text-center z-10"
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
          <div className="text-7xl font-normal mt-48">BAKTI UNAND</div>
          <div className="text-8xl font-normal mt-2">2025</div>
        </div>

        {/* Mobile Heading */}
        <div
          className="block lg:hidden relative w-full max-w-4xl mx-auto mt-6 text-[#623B1C] font-['Carena'] text-center z-10"
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
          <div className="text-3xl font-normal mt-32 ml-[6rem]">
            BAKTI UNAND
          </div>
          <div className="text-4xl font-normal mt-2 ml-[6rem]">2025</div>
        </div>
        {/* ====================================================== */}
        {/* ============ POSISI GAMBAR AWAN KIRI ================ */}
        {/* ====================================================== */}
        <img
          src={Awan}
          alt="Awan Kiri"
          className="absolute left-0 z-5" // Hapus 'bottom-0' dari sini
          style={{
            width: "55%",
            height: "30vh",
            objectFit: "cover",
            bottom: "-10vh", // TAMBAHKAN INI untuk menurunkan awan
          }}
        />

        {/* Get Started Button */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[55px] w-[225px] h-[52px] bg-[rgba(98,59,28,0.8)] rounded-[25px] border-2 border-orange-100 z-10 flex items-center justify-center duration-300 hover:scale-105 cursor-pointer">
          <a
            href="/login"
            className="text-white text-2xl font-bold font-['Poppins'] [text-shadow:_0px_3px_5px_rgb(0_0_0_/_0.25)]"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Other Sections */}
      <About />
      <Mascot />
      <Timeline />
      <Task />
      <Gallery />
      <Footer />
    </div>
  );
};

export default Home;
