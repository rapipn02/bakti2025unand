// File: routes/absen.route.js

const router = require("express").Router();
const absenController = require("../controllers/absen.controller"); // Pastikan path ini benar
const middleware = require("../middleware"); // Pastikan path ini benar

// Rute-rute untuk admin (CRUD Absensi)
router.get("/", middleware.authentication, middleware.isAdmin, absenController.GetAbsen);
router.post("/", middleware.authentication, middleware.isAdmin, absenController.AddAbsen);
router.put("/", middleware.authentication, middleware.isAdmin, absenController.EditAbsen);
router.delete("/", middleware.authentication, middleware.isAdmin, absenController.DeleteAbsen);

// Rute untuk user melakukan absensi
router.post("/absensi", middleware.authentication, absenController.AddAbsensi);
router.put("/absensi", middleware.authentication, absenController.EditAbsensiToNull);

// Admin scan QR peserta
router.post("/admin/scan", middleware.authentication, middleware.isAdmin, absenController.AdminScanParticipantQR);

// QR Scan route (admin atau user bisa scan)
router.post("/scan-qr", middleware.authentication, absenController.ScanQRAbsensi);

// Update status kehadiran (admin only)
router.put("/status", middleware.authentication, middleware.isAdmin, absenController.UpdateStatusKehadiran);

module.exports = router;