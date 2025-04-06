const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userModel = require('../models/ModelUser');

const generateToken = () => crypto.randomBytes(20).toString('hex');

const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    to: email,
    subject: 'Recuperación de Contraseña',
    html: `<p>Haz clic <a href="http://localhost:4000/reset-password/${token}">aquí</a> para restablecer tu contraseña.</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateToken, sendResetEmail };