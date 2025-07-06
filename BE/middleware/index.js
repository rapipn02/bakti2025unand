const validator = require("validatorjs")
const { extractToken } = require("../utils/utils");
const prisma = require("../prisma");

module.exports = {
    isEmail: async (req, res, next) => {
        try {
            const { email } = req.body;
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
            const checkEmail = await prisma.user.findFirst({
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
}