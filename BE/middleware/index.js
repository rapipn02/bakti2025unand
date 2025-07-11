const validator = require("validatorjs")
const { extractToken } = require("../utils/utils");
const prisma = require("../prisma");

module.exports = {
    isEmail: async (req, res, next) => {
        try {
            // Ambil email dari body ATAU query
            const email = req.body.email || req.query.email;
            const user = {
                email,
            }
            const rules = {
                email: "required|email",
            }
            const validate = new validator(user, rules)
            if (validate.fails()) {
                return res.status(400).json({
                    status: 400,
                    message: "Validation Error",
                    error: validate.errors
                })
            }
            return next();
        } catch (error) {
            console.log("Middleware Error:", error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
        }
    },
    isNim: async (req, res, next) => {
        try {
            const { nim } = req.body;
            const user = {
                nim,
            }
            const rules = {
                nim: "required|size:10",
            }
            const validate = new validator(user, rules)
            if (validate.fails()) {
                return res.status(401).json({
                    status: 401,
                    message: "Validation Error",
                    error: validate.errors
                })
            }
            if (isNaN(nim)) {
                return res.status(400).json({
                    status: 400,
                    message: "Enter a valid nim",
                })
            }
            return next();
        } catch (error) {
            console.log("Middleware Error:", error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
        }
    },
    authentication: async (req, res, next) => {
        try {
            if (req.headers && req.headers.authorization) {
                const token = req.headers.authorization.split(" ")[1];
                // const decoded = jsonwebtoken.verify(token, process.env.JWT_KEY);
                // req.user_data = decoded;
                if (token) {
                    const result = extractToken(token);
                    if (result) {
                        // console.log(result)
                        // res.locals.userEmail = result?.email
                        // console.log(res.locals.userEmail)
                        req.user = result
                        return next()
                    }
                }
                return res.status(401).send({
                    status: 401,
                    message: "Unauthorized",
                })
            } else {
                return res.status(401).json({
                    message: "Unauthorized",
                });
            }
        } catch (error) {
            console.log("Middleware Error:", error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
        }
    },
    register: async (req, res, next) => {
        try {
            const { name, email, password, confirmPassword } = req.body;
            const user = {
                name,
                email,
                password,
                confirmPassword,
            }
            const rules = {
                name: "required|string|max:50",
                email: "required|email",
                password: "required|min:1",
                confirmPassword: "required|same:password"
            }
            const validate = new validator(user, rules)
            if (validate.fails()) {
                return res.status(400).json({
                    status: 400,
                    message: "Validation Error",
                    error: validate.errors
                })
            }
            const checkEmail = await prisma.User.findFirst({
                where: { email }
            })
            if (checkEmail) {
                return res.status(401).json({
                    status: 401,
                    message: "Email is already used"
                })
            }
            return next();
        } catch (error) {
            console.log("Middleware Error:", error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
        }
    },
    isAdmin: async (req, res, next) => {
        try {
            // Pastikan user sudah authenticated
            if (!req.user) {
                return res.status(401).json({
                    status: 401,
                    message: "Unauthorized - User not authenticated"
                });
            }

            // Cek role admin langsung dari req.user (hasil decode token)
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({
                    status: 403,
                    message: "Forbidden - Admin access required",
                    debug: { userRole: req.user.role, required: 'ADMIN' }
                });
            }

            return next();
        } catch (error) {
            console.log("Admin Middleware Error:", error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            });
        }
    },
    validateKelompokId: async (req, res, next) => {
        try {
            const { kelompokId } = req.body || req.query || req.params;
            
            if (!kelompokId) {
                return res.status(400).json({
                    status: 400,
                    message: "Kelompok ID is required"
                });
            }

            // Validasi apakah kelompok exists
            const kelompok = await prisma.Kelompok.findUnique({
                where: { id: parseInt(kelompokId) }
            });

            if (!kelompok) {
                return res.status(404).json({
                    status: 404,
                    message: "Kelompok not found"
                });
            }

            return next();
        } catch (error) {
            console.log("Kelompok Validation Error:", error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            });
        }
    },
    validateTugasId: async (req, res, next) => {
        try {
            const { tugasId } = req.body || req.query || req.params;
            
            if (!tugasId) {
                return res.status(400).json({
                    status: 400,
                    message: "Tugas ID is required"
                });
            }

            // Validasi apakah tugas exists
            const tugas = await prisma.Tugas.findUnique({
                where: { id: tugasId }
            });

            if (!tugas) {
                return res.status(404).json({
                    status: 404,
                    message: "Tugas not found"
                });
            }

            return next();
        } catch (error) {
            console.log("Tugas Validation Error:", error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            });
        }
    },
    rateLimiter: (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
        const requests = new Map();
        
        return (req, res, next) => {
            const clientId = req.ip || req.connection.remoteAddress;
            const now = Date.now();
            
            // Clean old entries
            for (const [ip, data] of requests.entries()) {
                if (now - data.windowStart > windowMs) {
                    requests.delete(ip);
                }
            }
            
            // Check current client
            const clientData = requests.get(clientId);
            
            if (!clientData) {
                requests.set(clientId, {
                    count: 1,
                    windowStart: now
                });
                return next();
            }
            
            if (now - clientData.windowStart > windowMs) {
                // Reset window
                clientData.count = 1;
                clientData.windowStart = now;
                return next();
            }
            
            if (clientData.count >= maxRequests) {
                return res.status(429).json({
                    status: 429,
                    message: "Too many requests, please try again later"
                });
            }
            
            clientData.count++;
            return next();
        };
    },
}