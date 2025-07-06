// File: routes/absen.route.js

const router = require("express").Router();
const absenController = require("../controllers/absen.controller"); // Pastikan path ini benar
const middleware = require("../middleware"); // Pastikan path ini benar

// Rute-rute yang sudah ada
router.get("/", middleware.authentication, absenController.GetAbsen);
router.post("/", middleware.authentication, absenController.AddAbsen);
router.put("/", middleware.authentication, absenController.EditAbsen);
router.delete("/", middleware.authentication, absenController.DeleteAbsen);
router.post("/absensi", middleware.authentication, absenController.AddAbsensi);
router.put("/absensi", middleware.authentication, absenController.EditAbsensiToNull); // Sebaiknya ini juga DELETE jika tujuannya menghapus

// --- RUTE BARU UNTUK ADMIN SCAN QR PESERTA ---
router.post("/admin/scan",middleware.authentication,absenController.AdminScanParticipantQR);

module.exports = router;