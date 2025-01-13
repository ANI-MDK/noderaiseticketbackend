const nodemailer    = require("nodemailer")
const config        = require("../../../config/config")

const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
});

module.exports = transporter