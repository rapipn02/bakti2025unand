const router = require("express").Router();
const userController = require("../controllers/user.controller")
const middleware = require("../middleware")

// Rate limiter untuk login (max 5 attempts per 15 minutes)
const loginLimiter = middleware.rateLimiter(5, 15 * 60 * 1000);

// Public routes (tidak perlu authentication)
router.post("/", middleware.register, userController.Register)
router.post("/login", userController.Login)
// router.post("/login", loginLimiter, middleware.isEmail, userController.Login)


router.post("/google-login", loginLimiter, userController.LoginWithGoogle)
router.post("/generate-code", middleware.isEmail, userController.GenerateCode);
router.post("/forgotpassword", middleware.isEmail, userController.CheckCode);

// Google OAuth2 routes
router.get('/auth/google', userController.googleAuthRedirect);
router.get('/auth/google/callback', userController.googleAuthCallback);

// Protected routes (perlu authentication)
router.get("/", middleware.authentication, userController.GetUser)

module.exports = router