require('dotenv').config();
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);

const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors")
app.use(express.json())
// app.use(cors())
const corsConfig = {
    origin: "*",
    credential: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}
//halo
app.options("", cors(corsConfig))
//halo


app.use(cors(corsConfig))

const prismaMiddleware = async (req, res, next) => {
    req.prisma = prisma;
    next();
};

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Cek koneksi ke database saat startup
(async () => {
    try {
        await prisma.$connect();
        console.log("[PRISMA] Berhasil terkoneksi ke database!");
    } catch (err) {
        console.error("[PRISMA] Gagal koneksi ke database:", err);
    }
})();

// app.use(prismaMiddleware);
app.use(async (req, res, next) => {
    try {
        await prisma.$connect();
        console.log(`[PRISMA] Koneksi DB OK untuk ${req.method} ${req.url}`);
        await next();
    } catch (err) {
        console.error(`[PRISMA] ERROR koneksi DB untuk ${req.method} ${req.url}:`, err);
        return res.status(500).json({ status: 500, message: "Database connection error", error: err.message });
    } finally {
        await prisma.$disconnect();
    }
});

app.get("/", (req, res) => {
    return res.status(200).json({
        status: 200,
        message: "Hello Bro!!"
    })
})
app.get("/test", async (req, res) => {
    try {
        const data = await prisma.Anggota_Kelompok.findMany()
        return res.status(200).json({
            status: 200,
            message: "Berhasil",
            data
        })
    } catch (error) {
        console.log("Error", error)
        return res.status(500).json({
            status: 500,
            message: "Error",
            error
        })
    }
})
app.get("/test2", async (req, res) => {
    try {
        const data = await prisma.Anggota_Kelompok.findMany()
        return res.status(200).json({
            status: 200,
            message: "Berhasil",
            data
        })
    } catch (error) {
        console.log("Error", error)
        return res.status(500).json({
            status: 500,
            message: "Error",
            error
        })
    }
})

const { authentication } = require("./middleware");
app.get("/authentication", authentication, async (req, res) => {
    return res.status(200).json({
        status: 200,
        message: "Authorized",
        data: req.user
    })
})

const userRoute = require("./routes/user.route");
const tugasRoute = require("./routes/tugas.route");
const kelompokRoute = require("./routes/kelompok.route");
const absenRoute = require("./routes/absen.route");

app.use("/auth", userRoute)
app.use("/tugas", tugasRoute)
app.use("/kelompok", kelompokRoute)
app.use("/absen", absenRoute)


app.listen(port, () => {
    console.log("Server Running on port " + port)
})