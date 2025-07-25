import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import bookLogo from "../../assets/about/Open Book.svg";
import Seni from "../../assets/about/seni.svg";
import About1 from "../../assets/about/isometric view of colleagues having meeting.svg";
import About2 from "../../assets/about/man and woman at work.svg";
import About3 from "../../assets/about/isometric view of young woman working on laptop.svg";
import About4 from "../../assets/about/avatar of happy thankful man holding hands near heart.svg";
import Awan from "/awanfull.png";
import BungaOrnamen from "../../assets/timeline/bunga.svg";

export const About = () => {
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
    AOS.init({ duration: 800 });
  }, []);

  return (
    <section
      id="about"
      className="bg-[linear-gradient(to_bottom,#F6EDDD,#C3851D)] px-4 pt-28 relative pb-24"
    >
      {/* Awan */}
      <img
        src={Awan}
        alt="Awan Atas Terbalik"
        className="hidden lg:block absolute left-0 z-5"
        style={{
          width: "100%",
          height: "25vh",
          objectFit: "cover",
          top: "-5vh",
          transform: "scaleY(-1)",
        }}
      />
      <img
        src={Awan}
        alt="Awan Mobile"
        className="block lg:hidden absolute left-0 z-5"
        data-aos="fade-up"
        style={{
          width: "100%",
          height: "25vh",
          objectFit: "cover",
          top: "-5vh",
          transform: "scaleY(-1)",
        }}
      />

      {/* Ornamen Bunga */}
      {bungaPositions.map((pos, index) => (
        <img
          key={index}
          src={BungaOrnamen}
          alt="Ornamen Bunga"
          className="absolute w-16 md:w-20 z-0 opacity-50"
          style={pos}
        />
      ))}

      {/* Ringkasan */}
      <div className="min-h-screen flex flex-col items-center justify-start mt-16">
        <div
          className="text-center text-[#623B1C] text-5xl font-normal font-['Titan_One']"
          style={{
            textShadow: `-2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 2px 2px 0 white, 0 0 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 0, 0, 0.4)`,
          }}
          data-aos="fade-up"
        >
          <h1>
            Tahukah kamu,
            <br />
            Apa itu BAKTI UNAND ?
          </h1>
        </div>

        <h2
          className="max-w-3xl text-[#623B1C] text-2xl font-medium font-['Poppins'] mt-10 leading-relaxed text-center"
          data-aos="fade-up"
        >
          BAKTI atau Bimbingan Aktivitas Kemahasiswaan dalam Tradisi Ilmiah
          adalah kegiatan pengenalan terhadap program pendidikan, tradisi ilmiah
          dan pembinaan kegiatan kemahasiswaan di perguruan tinggi bagi
          mahasiswa baru Universitas Andalas.BAKTI UNAND menghadirkan
          serangkaian kegiatan yang bertujuan untuk mengenalkan lingkungan
          kampus kepada mahasiswa baru Universitas Andalas.
        </h2>

        <div data-aos="zoom-in">
          <a
            href="https://drive.google.com/drive/folders/1SNjhgJHlkHTv6P781pfKXvqvOHWuK7Ba?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="will-change-transform w-[350px] h-[50px] px-9 py-3 bg-[#623B1C] rounded-[20px] shadow-[0px_5px_6px_0px_rgba(0,0,0,0.25)] flex justify-center items-center gap-2 z-10 mt-8 relative text-orange-100 text-2xl font-bold font-['League_Spartan'] duration-300 hover:scale-110 transition-transform cursor-pointer"
          >
            Buku Panduan
            <img className="w-8 h-8 ml-2" src={bookLogo} alt="Buku Panduan" />
          </a>
        </div>

        <img
          src={Seni}
          alt="seni"
          className="w-[100%] mx-auto mt-16 md:w-auto md:mt-0"
          data-aos="fade-up"
        />
      </div>

      {/* Detail */}
      <div className="mt-32 max-w-6xl mx-auto px-4 md:px-8 text-[#623B1C] font-['Poppins']">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 items-stretch">
          {/* CARD 1 */}
          <div data-aos="fade-up" className="h-full">
            <div className="bg-[#F6EDDD] h-full w-full rounded-xl p-8 shadow-md border-[3px] border-yellow-900 duration-300 hover:scale-[1.03] cursor-pointer transition-transform flex flex-col">
              {/* Konten: Gambar + Teks */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 h-full">
                <img
                  className="w-full md:w-[220px] h-[300px] object-contain flex-shrink-0"
                  src={About1}
                  alt="Rangers Afeksi"
                />
                <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                  <h3
                    className="text-2xl md:text-3xl font-['Titan_One'] mb-4 text-center"
                    style={{
                      textShadow: `-2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 2px 2px 0 white`,
                    }}
                  >
                    Rangers Afeksi
                  </h3>
                  <p className="font-bold text-center">
                    Salah satu rangkaian kegiatan Pra-BAKTI yang bertujuan untuk
                    membangun komunikasi antara mentor dengan mahasiswa baru
                    serta membangun keakraban dalam satu kelompok.
                  </p>
                </div>
              </div>

              {/* Tombol di tengah seluruh card */}
              <div className="flex justify-center mt-8">
                <a
                  href="https://drive.google.com/drive/folders/1SKDoS__cBn8QZnm1Hh2RRT9S92ZhAuRj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-3 bg-[#623B1C] text-white font-bold font-['Poppins'] rounded-xl shadow-md border transition duration-300 hover:scale-105 cursor-pointer"
                >
                  Ketuk untuk selengkapnya
                </a>
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div data-aos="fade-up" className="h-full">
            <div className="bg-[#F6EDDD] h-full w-full rounded-xl p-8 shadow-md border-[3px] border-yellow-900 duration-300 hover:scale-[1.03] cursor-pointer transition-transform flex flex-col">
              {/* Gambar + Teks */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 h-full">
                <img
                  className="w-full md:w-[220px] h-[300px] object-contain flex-shrink-0"
                  src={About2}
                  alt="Mentor BAKTI"
                />
                <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                  <h3
                    className="text-2xl md:text-3xl font-['Titan_One'] mb-4 text-center"
                    style={{
                      textShadow: `-2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 2px 2px 0 white`,
                    }}
                  >
                    Maba will get cool mentors
                  </h3>
                  <p className="font-bold text-center">
                    Mahasiswa atau mahasiswi baru akan didampingi uda uni mentor
                    yang siap membantu serta mendampingi selama rangkaian
                    kegiatan BAKTI.
                  </p>
                </div>
              </div>

              {/* Tombol di tengah seluruh card */}
              <div className="flex justify-center mt-6">
                <a
                  href="https://drive.google.com/drive/folders/1SS-WReEqfOxpZfYqvqHrsh7YXF8DKR3M?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-[#623B1C] text-white font-bold font-['Poppins'] rounded-xl shadow-md border transition duration-300 hover:scale-105 cursor-pointer"
                >
                  Ketuk untuk selengkapnya
                </a>
              </div>
            </div>
          </div>

          {/* CARD 3 */}
          <div data-aos="fade-up" className="h-full">
            <div className="bg-[#F6EDDD] h-full w-full rounded-xl p-8 shadow-md border-[3px] border-yellow-900 duration-300 hover:scale-[1.03] cursor-pointer transition-transform flex flex-col">
              {/* Konten: Gambar + Teks */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 h-full">
                <img
                  className="w-full md:w-[200px] h-[340px] object-contain flex-shrink-0"
                  src={About3}
                  alt="Maba's Task"
                />
                <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                  <h3
                    className="text-3xl font-['Titan_One'] mb-10 text-center"
                    style={{
                      textShadow:
                        "-2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 2px 2px 0 white",
                    }}
                  >
                    Maba's Task
                  </h3>
                  <p className="font-bold text-base text-center">
                    Setiap mahasiswa baru Universitas Andalas akan diberikan
                    penugasan selama rangkaian kegiatan BAKTI dengan harapan
                    mahasiswa baru mendapatkan output sesuai dengan penugasan
                    yang telah diberikan.
                  </p>
                </div>
              </div>

              {/* Tombol di tengah seluruh card */}
              <div className="flex justify-center mt-6">
                <a
                  href="https://drive.google.com/drive/folders/1SN_yUY4aGT-lcp1_NIgGAE9GvG-RTRmY?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-[#623B1C] text-white font-bold font-['Poppins'] rounded-xl shadow-md border transition duration-300 hover:scale-105 cursor-pointer"
                >
                  Ketuk untuk selengkapnya
                </a>
              </div>
            </div>
          </div>

          {/* CARD 4 */}
          <div data-aos="fade-up" className="h-full">
            <div className="bg-[#F6EDDD] h-full w-full rounded-xl p-6 shadow-md border-[3px] border-yellow-900 duration-300 hover:scale-[1.03] cursor-pointer transition-transform flex flex-col">
              <a
                href="https://drive.google.com/drive/folders/1SN_yUY4aGT-lcp1_NIgGAE9GvG-RTRmY"
                target="_blank"
                rel="noopener noreferrer"
                className="h-full"
              ></a>
              {/* Konten Card */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 h-full">
                <img
                  className="w-full md:w-[200px] h-[340px] object-contain flex-shrink-0"
                  src={About4}
                  alt="UKM dan HIMADA"
                />
                <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                  <h3
                    className="text-2xl font-['Titan_One'] mb-3 text-center"
                    style={{
                      textShadow: `-2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 2px 2px 0 white`,
                    }}
                  >
                    UKM dan HIMADA
                    <br /> Universitas Andalas
                  </h3>
                  <p className="font-bold text-base  text-center">
                    Universitas Andalas memiliki berbagai Unit Kegiatan
                    Mahasiswa (UKM) yang dapat menjadi wadah untuk mahasiswa
                    mengembangkan soft skill dan hard skill yang dimiliki sesuai
                    dengan bakat dan minatnya, serta Himpunan Mahasiswa Daerah
                    (HIMADA).
                  </p>
                </div>
              </div>

              {/* Tombol di tengah card */}
              <div className="flex justify-center mt-6">
                <a
                  href="https://drive.google.com/drive/folders/1SS-WReEqfOxpZfYqvqHrsh7YXF8DKR3M?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-[#623B1C] text-white font-bold font-['Poppins'] rounded-xl shadow-md border transition duration-300 hover:scale-105 cursor-pointer"
                >
                  Ketuk untuk selengkapnya
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
