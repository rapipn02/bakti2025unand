const router = require("express").Router();
const kelompokController = require("../controllers/kelompok.controller")
const middleware = require("../middleware")

// Admin routes - CRUD Kelompok
router.get("/", middleware.authentication, middleware.isAdmin, kelompokController.GetKelompok)
router.post("/", middleware.authentication, middleware.isAdmin, kelompokController.AddKelompok)
router.delete("/", middleware.authentication, middleware.isAdmin, kelompokController.DeleteKelompok)

// Admin routes - CRUD Anggota Kelompok
router.get("/anggota", middleware.authentication, middleware.isAdmin, kelompokController.GetAnggotaKelompokById)
router.get("/anggota/with-absensi", middleware.authentication, middleware.isAdmin, kelompokController.GetAnggotaKelompokWithAbsensi)
router.get("/anggota/search", middleware.authentication, middleware.isAdmin, kelompokController.GetSearchAnggotaKelompokById)
router.get("/anggota/all", middleware.authentication, middleware.isAdmin, kelompokController.GetAllAnggotaKelompok)
router.get("/anggota/by-nim/:nim", middleware.authentication, middleware.isAdmin, kelompokController.GetAnggotaByNim)
router.post("/anggota", middleware.authentication, middleware.isAdmin, middleware.isNim, kelompokController.AddAnggotaKelompok)
router.put("/anggota", middleware.authentication, middleware.isAdmin, middleware.isNim, kelompokController.EditAnggotaKelompok)
router.delete("/anggota", middleware.authentication, middleware.isAdmin, kelompokController.DeleteAnggotaKelompok)

// QR Code Routes (admin only)
router.get("/anggota/:anggotaId/qr", middleware.authentication, middleware.isAdmin, kelompokController.GenerateAnggotaQR);


module.exports = router