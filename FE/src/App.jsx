import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Dashboard/home";
import Login from "./Pages/Login/login";
import Signup from "./Pages/SignUp/signup";
import LupaSandi from "./Pages/LupaSandi/lupasandi";
import PageNotFound from "./Pages/PageNotFound/pagenotfound";
import Pengumpulantugas from "./Pages/User/pengumpulantugas";
import About from "./Pages/Dashboard/about";
import Maskot from "./Pages/Dashboard/mascot";
import Timeline from "./Pages/Dashboard/timeline";
import Gallery from "./Pages/Dashboard/gallery";
import ListAbsen from "./Pages/Admin/listabsensi/listabsen";
import AddAbsen from "./Pages/Admin/listabsensi/addabsen";
import Absensi from "./Pages/Admin/absen/absensi";
import Kelompok from "./Pages/Admin/kelompokbaktiunand/kelompok";
import Kumpultugas from "./Pages/Admin/kumpultugas/kumpultugas";
import AddTugas from "./Pages/Admin/kumpultugas/addtugas";
import AnggotaKelompok from "./Pages/Admin/kelompokbaktiunand/anggotakelompok";
import AddAnggotaKelompok from "./Pages/Admin/kelompokbaktiunand/addanggotakelompok";
import AddKelompok from "./Pages/Admin/kelompokbaktiunand/addkelompok";
import Tugas from "./Pages/Admin/kumpultugas/tugas";

export const App = () => {
  return (
    <Router>
      <Routes>
        {/* ===== USER ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/#about" element={<About />} />
        <Route path="/#maskot" element={<Maskot />} />
        <Route path="/#timeline" element={<Timeline />} />
        <Route path="/#gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lupasandi" element={<LupaSandi />} />
        <Route path="/pengumpulantugas" element={<Pengumpulantugas />} />

        {/* ===== ADMIN ===== */}
        <Route path="/listabsen" element={<ListAbsen />} />
        <Route path="/addabsen" element={<AddAbsen />} />
        <Route path="/absensi" element={<Absensi />} />
        <Route path="/kelompok" element={<Kelompok />} />
        <Route path="/addkelompok" element={<AddKelompok />} />
        <Route path="/anggotakelompok" element={<AnggotaKelompok />} />
        <Route path="/addanggotakelompok" element={<AddAnggotaKelompok />} />
        <Route path="/kumpultugas" element={<Kumpultugas />} />
        <Route path="/addtugas" element={<AddTugas />} />
        <Route path="/tugas" element={<Tugas />} />

        {/* ===== ERROR ===== */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
