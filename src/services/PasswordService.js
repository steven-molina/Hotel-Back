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
    html: `
    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    <a href="${process.env.BACKEND}/api/reset-password/${token}">
      Restablecer contraseña
    </a>
    <p>Si no solicitaste este cambio, ignora este mensaje.</p>
  `
    
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateToken, sendResetEmail };