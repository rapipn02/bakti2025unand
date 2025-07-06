const router = require("express").Router();
const tugasController = require("../controllers/tugas.controller")
const middleware = require("../middleware")
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer(storage)


router.get("/", middleware.authentication, tugasController.GetTugas)
router.post("/", middleware.authentication, tugasController.AddTugas)
router.put("/", middleware.authentication, tugasController.EditTugas)
router.delete("/", middleware.authentication, tugasController.DeleteTugas)
router.get("/kumpul/all", middleware.authentication, tugasController.GetKumpulTugas)
router.get("/kumpul", middleware.authentication, tugasController.GetKumpulTugasByKelompok)
router.get("/kumpul/search", middleware.authentication, tugasController.SearchGetKumpulTugasByKelompok)
router.post("/kumpul", middleware.authentication, middleware.isNim, tugasController.KumpulTugas)
router.put("/kumpul", middleware.authentication, middleware.isNim, tugasController.EditKumpulTugas)

module.exports = router