const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config();

exports.hashPassword = (rawPassword) => {
    return bcrypt.hashSync(rawPassword, 10);
}

exports.comparePassword = (rawPassword, hash) => {
    return bcrypt.compareSync(rawPassword, hash);
}


exports.generateToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_TOKEN_KEY, { expiresIn: "1d" });
    // console.log(data, token)
    return token;
}
exports.generateFreshToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_REFRESH_TOKEN_KEY, { expiresIn: "1d" });
    // console.log(data, token)
    return token;
}

exports.extractToken = (token) => {
    const secretKey = process.env.JWT_TOKEN_KEY;
    let resData;
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            resData = null
        } else {
            resData = decoded
        }
    })

    if (resData) {
        return resData;
    }
    return null;
}

exports.extractRefreshToken = (token) => {
    const secretKey = process.env.JWT_REFRESH_TOKEN_KEY;
    let resData;
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            resData = null
        } else {
            resData = decoded
        }
    })

    if (resData) {
        return resData;
    }
    return null;
}
