const router = require("express").Router();
const tugasController = require("../controllers/tugas.controller")
const middleware = require("../middleware")
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer(storage)

// Admin routes - CRUD Tugas
router.get("/", middleware.authentication, tugasController.GetTugas)
router.post("/", middleware.authentication, middleware.isAdmin, tugasController.AddTugas)
router.put("/", middleware.authentication, middleware.isAdmin, tugasController.EditTugas)
router.delete("/", middleware.authentication, middleware.isAdmin, tugasController.DeleteTugas)

// Admin routes - View Kumpul Tugas
router.get("/kumpul/all", middleware.authentication, tugasController.GetKumpulTugas)
router.get("/kumpul", middleware.authentication, tugasController.GetKumpulTugasByKelompok)
router.get("/kumpul/search", middleware.authentication, tugasController.SearchGetKumpulTugasByKelompok)

// User routes - Submit Tugas
router.post("/kumpul", middleware.authentication, middleware.isNim, tugasController.KumpulTugas)
router.put("/kumpul", middleware.authentication, middleware.isNim, tugasController.EditKumpulTugas)

module.exports = router