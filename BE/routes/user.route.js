const router = require("express").Router();
const userController = require("../controllers/user.controller")
const middleware = require("../middleware")

router.post("/", middleware.register, userController.Register)
router.post("/login", middleware.isEmail, userController.Login)
router.post("/google-login", userController.LoginWithGoogle)
router.get("/", userController.GetUser)
router.post("/generate-code", userController.GenerateCode);
router.post("/forgotpassword", userController.CheckCode);

module.exports = router