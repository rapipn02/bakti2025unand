import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import BackgroundImage from "/background.webp";
import HomeMobile from "/baktiunandmobile.webp";
import Awan from "/awanfull.png";
import Navbar from "../../component/Navbar";
import About from "./about";
import Mascot from "./mascot";
import Timeline from "./timeline";
import Task from "./task";
import Gallery from "./gallery";
import Footer from "../../component/footer";
import Loading from "../../component/loading";


const Home = () => {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const footerRef = useRef(null);
  // Scroll to top handler
  const handleScrollTop = () => {
    const hero = document.getElementById('home');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Show button if footer is visible
  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      setShowScrollTop(isVisible);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  if (loading || authLoading) {
    return <Loading />;
  }

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
          data-aos="zoom-in"
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
          data-aos="zoom-in"
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
          <div className="text-3xl font-normal mt-34 ml-[6rem]">
            BAKTI UNAND
          </div>
          <div className="text-4xl font-normal mt-2 ml-[6rem]">2025</div>
        </div>

        {/* Awan untuk Desktop */}
        <img
          src={Awan}
          alt="Awan Desktop"
          className="hidden lg:block absolute left-0 z-5"
          style={{
            width: "100%",
            height: "25vh",
            objectFit: "cover",
            bottom: "-10vh",
          }}
        />

        {/* Awan untuk Mobile */}
        <img
          src={Awan}
          alt="Awan Mobile"
          className="block lg:hidden absolute left-0 z-5"
          style={{
            width: "100%",
            height: "15vh",
            objectFit: "cover",
            bottom: "-1vh",
          }}
        />

        {/* Get Started Button for Desktop */}
        {!isAuthenticated && (
          <div data-aos="zoom-in">
            <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 bottom-[-31vh] w-[215px] h-[52px] bg-[rgba(98,59,28,0.8)] rounded-[18px] border-2 border-orange-100 z-10 items-center justify-center duration-300 ease-in-out hover:scale-105 cursor-pointer transition-transform will-change-transform">
              <a
                href="/login"
                className="text-white text-2xl font-bold font-['Poppins'] [text-shadow:_0px_3px_5px_rgb(0_0_0_/_0.25)]"
              >
                Get Started
              </a>
            </div>
          </div>
        )}

        {/* Get Started Button for Mobile */}
        {!isAuthenticated && (
          <div
            data-aos="zoom-in"
            className="flex lg:hidden relative mt-0 ml-auto mr-23 w-[150px] h-[48px] bg-[rgba(98,59,28,0.8)] rounded-[22px] border-5 border-[#F6EDDD] z-10 items-center justify-center duration-300 hover:scale-105 cursor-pointer"
          >
            <a
              href="/login"
              className="text-white text-xl font-bold font-['Poppins'] [text-shadow:_0px_3px_5px_rgb(0_0_0_/_0.25)]"
            >
              Get Started
            </a>
          </div>
        )}
      </section>

      {/* Other Sections */}
      <About />
      <Mascot />
      <Timeline />
      <Task />
      <Gallery />
      <div ref={footerRef}>
        <Footer />
      </div>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          className="fixed bottom-8 right-8 z-50 bg-[#623B1C] text-white p-4 rounded-full shadow-lg hover:bg-[#4e2e13] transition-all duration-300  border-2 border-[#c78317] cursor-pointer"
          aria-label="Kembali ke atas"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Home;
