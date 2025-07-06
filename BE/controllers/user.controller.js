const { v4: uuidv4 } = require("uuid");
const {
  hashPassword,
  comparePassword,
  generateToken,
  generateFreshToken,
} = require("../utils/utils");
const prisma = require("../prisma");
const crypto = require("crypto");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "pipkttzy@gmail.com",
    pass: "cavv kcgo jqps hudi",
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
    console.log(req.body);

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
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
    } else {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          image,
          password: hashPassword(password),
        },
      });
      if (!newUser) {
        return res.status(402).json({
          status: 402,
          message: "Failed to make new account",
        });
      }
      const isPasswordCorrect = comparePassword(password, newUser.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          status: 401,
          message: "Email/Nim or Password is wrong",
        });
      }

      const dataUser = { ...newUser, password: "-" };
      const token = generateToken(dataUser);

      return res.status(201).json({
        status: 201,
        data: { ...dataUser },
        token,
      });
    }
  } catch (error) {
    console.log("Login Controller Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
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
        name: "Bakti Unand 2024",
        address: "pipkttzy@gmail.com",
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
