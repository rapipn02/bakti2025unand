import React from "react";
import Logo from "../assets/auth/Bakti.svg";
import Neo from "../assets/Footer/NeoTelemetri.svg";
import Instagram from "../assets/Footer/ig.svg";
import TikTok from "../assets/Footer/tiktok.svg";
import Youtube from "../assets/Footer/yt.svg";
import Spotify from "../assets/Footer/spotify.svg";

const Footer = () => {
  return (
    <footer className="bg-[#c78317] text-white pt-10 px-8 font-['Poppins'] overflow-x-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Kolom 1: Logo dan Deskripsi */}
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <img src={Logo} alt="Logo" className="w-12 h-12" />
            <h1 className="text-2xl font-normal font-['Carena'] drop-shadow-sm text-white">
              BAKTI UNAND
            </h1>
          </div>
          <p className="text-sm leading-relaxed text-white text-justify">
            BAKTI atau Bimbingan Aktivitas Kemahasiswaan dalam Tradisi Ilmiah
            adalah kegiatan pengenalan terhadap program pendidikan, tradisi
            ilmiah dan pembinaan kegiatan kemahasiswaan di perguruan tinggi bagi
            mahasiswa baru Universitas Andalas
          </p>
        </div>

        {/* Kolom 2: Quick Links */}
        <div>
          <h2 className="text-lg font-bold mb-3 text-center">QUICKS LINKS</h2>
          <div className="flex flex-col items-center md:items-start space-y-1 text-white text-base px-0 md:px-22">
            <a href="#" className="hover:underline">
              Home
            </a>
            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#maskot" className="hover:underline">
              Maskot
            </a>
            <a href="#timeline" className="hover:underline">
              Timeline
            </a>
            <a href="#task" className="hover:underline">
              Task
            </a>
            <a href="#gallery" className="hover:underline">
              Gallery
            </a>
          </div>
        </div>

        {/* Kolom 3: Developer Website */}
        <div>
          <h2 className="text-lg font-bold mb-3 text-center">WEBSITE</h2>
          <div className="space-y-4 text-sm text-center">
            <div>
              <p className="font-bold font-['Poppins']">Frontend Developer</p>
              <a
                href="https://www.instagram.com/daf_nal/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center text-white "
              >
                <img src={Instagram} alt="Instagram" className="w-5 h-5" />
                Rizki Dafa Naldi
              </a>
            </div>
            <div>
              <p className="font-bold font-['Poppins']">Backend Developer</p>
              <a
                href="https://www.instagram.com/rapip_n/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center text-white "
              >
                <img src={Instagram} alt="Instagram" className="w-5 h-5" />
                Naufal Rafiif Irwan
              </a>
            </div>
            <div>
              <p className="font-bold font-['Poppins']">UI/UX Design</p>
              <a
                href="https://www.instagram.com/assyfarzqi_/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center text-white "
              >
                <img src={Instagram} alt="Instagram" className="w-5 h-5" />
                Assyfa Razaqi
              </a>
            </div>
          </div>
        </div>

        {/* Kolom 4: Sosial Media dan Kontak */}
        <div>
          <h2 className="text-lg font-bold mb-3 text-center">FOLLOW US</h2>
          <div className="flex gap-x-2 gap-y-4 mb-5 w-fit mx-auto place-items-center">
            <a
              href="https://www.instagram.com/bakti.unand?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Instagram} alt="Instagram" className="w-10 h-10" />
            </a>
            <a
              href="https://www.facebook.com/baktiunand?mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Spotify} alt="Spotify" className="w-10 h-10" />
            </a>

            <a
              href="https://www.tiktok.com/@bakti.unand?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={TikTok} alt="Tiktok" className="w-10 h-10" />
            </a>
            <a
              href="https://youtube.com/@baktiunand25?si=uEwhrmv9lE7PGUue"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Youtube} alt="Youtube" className="w-10 h-10" />
            </a>
          </div>

          <h2 className="text-lg font-bold mb-2 text-center">CONTACT US</h2>
          <p className="text-sm leading-relaxed text-center">
            <a
              href="https://wa.me/628971504300"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#c78317] hover:underline"
            >
              +62 897 1504 300
            </a>
            <br />
            baktiunand2025@gmail.com
          </p>

        </div>
      </div>

      {/* Bawah: lokasi, logo Telemetri, hak cipta */}
      <div className="text-center text-sm space-y-1 pb-5 mt-4">
        <p>
          Universitas Andalas, Limau Manis, Padang, Sumatra Barat, Indonesia
        </p>
        {/* Garis bawah */}
        <hr className="my-5 border-white/30" />
        <div className="flex flex-wrap items-center justify-center gap-3 px-4">
          <img
            src={Neo}
            alt="NeoTelemetri"
            className="h-10 max-w-full  object-contain"
          />
          <p className="text-sm text-white whitespace-nowrap">
            © 2025 MIT Bakti Unand. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
