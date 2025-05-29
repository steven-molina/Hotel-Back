// src/libs/CrearToken.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const CrearToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id ,
      rol: usuario.rol,
      nombreusuario: usuario.nombreUsuario
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

module.exports = { CrearToken }; //Exporta como objeto