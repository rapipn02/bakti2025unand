import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
import ScanQRPage from "./Pages/Admin/qr/ScanQRPage";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              duration: 2000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
            // Prevent duplicate toasts
            id: 'unique-toast',
          }}
          containerStyle={{
            top: 20,
          }}
          gutter={8}
          reverseOrder={false}
        />
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
          <Route 
            path="/pengumpulantugas" 
            element={
              <ProtectedRoute>
                <Pengumpulantugas />
              </ProtectedRoute>
            } 
          />

          {/* ===== ADMIN ===== */}
          <Route 
            path="/listabsen" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <ListAbsen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addabsen" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddAbsen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/absensi" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Absensi />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/kelompok" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Kelompok />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addkelompok" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddKelompok />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/anggotakelompok" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AnggotaKelompok />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addanggotakelompok" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddAnggotaKelompok />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/kumpultugas" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Kumpultugas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addtugas" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddTugas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tugas" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Tugas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scan-qr/:absensiId" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <ScanQRPage />
              </ProtectedRoute>
            } 
          />

          {/* ===== ERROR ===== */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
//halo
//AA
//aa
export default App;
