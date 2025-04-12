// src/libs/CrearToken.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const CrearToken = (userId,rol) => {
  return jwt.sign(
    { id: userId ,
      rol: rol
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = { CrearToken }; //Exporta como objeto