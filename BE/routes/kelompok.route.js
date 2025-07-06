const router = require("express").Router();
const kelompokController = require("../controllers/kelompok.controller")
const middleware = require("../middleware")


router.get("/", middleware.authentication, kelompokController.GetKelompok)
router.post("/", middleware.authentication, kelompokController.AddKelompok)
router.delete("/", middleware.authentication, kelompokController.DeleteKelompok)
router.get("/anggota", middleware.authentication, kelompokController.GetAnggotaKelompokById)
router.get("/anggota/search", middleware.authentication, kelompokController.GetSearchAnggotaKelompokById)
router.get("/anggota/all", middleware.authentication, kelompokController.GetAllAnggotaKelompok)
router.post("/anggota", middleware.authentication, middleware.isNim, kelompokController.AddAnggotaKelompok)
router.put("/anggota", middleware.authentication, middleware.isNim, kelompokController.EditAnggotaKelompok)
router.delete("/anggota", middleware.authentication, kelompokController.DeleteAnggotaKelompok)

// QR Code Routes
router.get("/anggota/:anggotaId/qr", middleware.authentication, kelompokController.GenerateAnggotaQR);


module.exports = router