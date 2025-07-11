import React, { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "../../component/Navbar";
import Footer from "../../component/footer";
import Loading from "../../component/loading";

// Lazy-load bagian berat
const About = lazy(() => import("./about"));
const Mascot = lazy(() => import("./mascot"));
const Timeline = lazy(() => import("./timeline"));
const Task = lazy(() => import("./task"));
const Gallery = lazy(() => import("./gallery"));

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("hasLoadedInSession");

    if (!hasLoaded) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasLoadedInSession", "true");
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="pt-0">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-screen w-full overflow-hidden">
        {/* Background dari public */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center hidden lg:block"
          style={{
            backgroundImage: `url(/background.svg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            willChange: "transform",
          }}
        />
        <div
          className="absolute inset-0 z-0 bg-cover bg-center block lg:hidden"
          style={{
            backgroundImage: `url(/baktiunandmobile.svg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            willChange: "transform",
          }}
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
          <div className="text-3xl font-normal mt-34 ml-[6rem]">BAKTI UNAND</div>
          <div className="text-4xl font-normal mt-2 ml-[6rem]">2025</div>
        </div>

        {/* Awan (img tag dari public) */}
        <img
          src="/awanfull.svg"
          loading="eager"
          alt="Awan Desktop"
          className="hidden lg:block absolute left-0 z-5"
          style={{
            width: "100%",
            height: "25vh",
            objectFit: "cover",
            bottom: "-10vh",
          }}
        />
        <img
          src="/awanfull.svg"
          loading="eager"
          alt="Awan Mobile"
          className="block lg:hidden absolute left-0 z-5"
          style={{
            width: "100%",
            height: "auto",
            bottom: "-20vh",
          }}
        />

        {/* Tombol Get Started */}
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 bottom-[75px] w-[215px] h-[52px] bg-[rgba(98,59,28,0.8)] rounded-[18px] border-2 border-orange-100 z-10 items-center justify-center duration-300 hover:scale-105 cursor-pointer">
          <a
            href="/login"
            className="text-white text-2xl font-bold font-['Poppins'] [text-shadow:_0px_3px_5px_rgb(0_0_0_/_0.25)]"
          >
            Get Started
          </a>
        </div>

        <div className="flex lg:hidden relative mt-2 ml-auto mr-18 w-[150px] h-[48px] bg-[rgba(98,59,28,0.8)] rounded-[22px] border-5 border-[#F6EDDD] z-10 items-center justify-center duration-300 hover:scale-105 cursor-pointer">
          <a
            href="/login"
            className="text-white text-xl font-bold font-['Poppins'] [text-shadow:_0px_3px_5px_rgb(0_0_0_/_0.25)]"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Lazy Loaded Sections */}
      <Suspense fallback={<div className="text-center my-10 text-gray-500">Loading sections...</div>}>
        <About />
        <Mascot />
        <Timeline />
        <Task />
        <Gallery />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Home;
