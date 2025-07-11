const { v4: uuidv4 } = require("uuid");
const {
  hashPassword,
  comparePassword,
  generateToken,
  generateFreshToken,
} = require("../utils/utils");
const prisma = require("../prisma");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "YOUR_CLIENT_SECRET";
const REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:4000/auth/google/callback";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "baktiunand2025@gmail.com",
    pass: "fani dhmo nuxq eyvk",
  },
});

exports.Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword(password),
        image: "",
      },
    });

    return res.status(200).json({
      status: 200,
      account: user,
    });
  } catch (error) {
    console.log("Register Controller Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password) {
      return res.status(402).json({
        status: 402,
        message: "Password is must fields",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found!",
      });
    }

    const isPasswordCorrect = comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 401,
        message: "Email or Password is wrong",
      });
    }

    const dataUser = { ...user, password: "-" };
    const token = generateToken(dataUser);

    return res.status(200).json({
      status: 200,
      data: { ...dataUser },
      token,
    });
  } catch (error) {
    console.log("Login Controller Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

exports.LoginWithGoogle = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;
    let user = await prisma.user.findFirst({ where: { email } });

    if (user) {
      // Jangan cek password, langsung login
      const dataUser = { ...user, password: '-' };
      const token = generateToken(dataUser);
      return res.status(200).json({
        status: 200,
        data: { ...dataUser },
        token,
      });
    } else {
      // Buat user baru
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          image,
          password: hashPassword(password),
        },
      });
      const dataUser = { ...newUser, password: '-' };
      const token = generateToken(dataUser);
      return res.status(201).json({
        status: 201,
        data: { ...dataUser },
        token,
      });
    }
  } catch (error) {
    console.log('Login Controller Error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error,
    });
  }
};

exports.GetUser = async (req, res) => {
  try {
    const user = await prisma.user.findMany();
    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error) {
    console.log("Login Controller Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

exports.GenerateCode = async (req, res) => {
  try {
    const check = await prisma.user.findFirst({
      where: {
        email: req.query.email,
      },
    });
    if (!check) {
      return res.status(404).json({
        status: 404,
        message: "Email tidak di temukan",
      });
    }

    try {
      await prisma.verify.deleteMany({
        where: {
          userId: check.id,
        },
      });
    } catch (error) {
      console.log("Failed delete code", error);
    }

    const code = await prisma.verify.create({
      data: {
        userId: check.id,
        code: crypto.randomUUID().slice(0, 8).toUpperCase(),
      },
    });

    if (!code) {
      return res.status(403).json({
        status: 403,
        message: "Gagal generate code!",
      });
    }
    const info = await transporter.sendMail({
      from: {
        name: "Bakti Unand 2025",
        address: "baktiunand2025@gmail.com",
      },
      to: `${req.query.email}`,
      subject: "Recovery Password",
      html: `<div>Your Code : ${code.code}</div>`,
    });

    return res.status(200).json({
      status: 200,
      data: info,
    });
  } catch (error) {
    console.log("Login Controller Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

exports.CheckCode = async (req, res) => {
  try {
    const code = await prisma.verify.findFirst({
      orderBy: {
        createAt: "desc",
      },
      where: {
        userId: req.query.userId,
      },
    });
    if (!code) {
      return res.status(404).json({
        status: 404,
        message: "Code tidak di temukan",
      });
    }

    if (code.code == req.body.code) {
      try {
        await prisma.user.update({
          where: {
            email: req.body.email,
          },
          data: {
            password: hashPassword(req.body.password),
          },
        });
      } catch (error) {
        console.log(error);
        return res.status(402).json({
          status: 402,
          message: "Failed Recovery Password",
        });
      }
      try {
        await prisma.verify.deleteMany({
          where: {
            userId: req.body.userId,
          },
        });
      } catch (error) {
        console.log("Failed delete code", error);
      }
      return res.status(200).json({
        status: 200,
        message: "Berhasil Recovery Password",
      });
    }

    return res.status(403).json({
      status: 403,
      message: "Code tidak sesuai",
    });
  } catch (error) {
    console.log("Login Controller Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};

// Redirect user to Google login
exports.googleAuthRedirect = (req, res) => {
  const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=${encodeURIComponent(scope.join(" "))}`;
  res.redirect(url);
};

// Handle Google callback
exports.googleAuthCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ message: "No code provided" });
  try {
    const { tokens } = await new OAuth2Client(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    ).getToken(code);
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // Find or create user
    let user = await prisma.user.findFirst({ where: { email: payload.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          image: payload.picture,
          password: hashPassword("google_" + payload.sub),
        },
      });
    }
    const dataUser = { ...user, password: "-" };
    const token = generateToken(dataUser);
    // Redirect to frontend with token (or set cookie, etc)
    res.redirect(`http://localhost:5173/login?token=${token}`);
  } catch (err) {
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
};
