const servicioUser = require("../services/ServicioUser");
const userModel = require("../models/ModelUser");
const TokenCreate = require("../libs/CrearToken");
const PasswordService = require('../services/PasswordService');
const dotenv = require("dotenv");
const crypto = require('crypto');
dotenv.config();
const jwt = require("jsonwebtoken");
// const Verificar = require("../libs/VerificarLogin");
const registrarse = async (req, res, next) => {
  try {
    const { nombreUsuario, correo, password } = req.body;
    const usuario = {
      nombreUsuario,
      correo,
      password,
    };
    //ocultar contraseña
    const usernuevo = new userModel(usuario);
    usernuevo.password = await usernuevo.ocultar(usuario.password);

    token = await TokenCreate.CrearToken(usernuevo.id);
    
    const userExiste = await servicioUser.verificarUserName(nombreUsuario);
    if (userExiste) {
      return res
        .status(400)
        .json({ mensaje: ["el nombre de usuario ya existe"] });
    }
    const respuesta = await servicioUser.registrarse(usernuevo);
    console.log("usuario. ", respuesta);
    res.cookie("token", token);
    res.status(200).send(respuesta);
    // res.json({auth:true,token:respuesta});
  } catch (error) {
    next(error);
  }
};
//iniciar sesion
const login = async (req, res, next) => {
  try {
    const { nombreUsuario, password } = req.body;
    console.log("username: ", nombreUsuario + " contraseña: ", password);
    const respuesta = await servicioUser.login(nombreUsuario, password);
    if (!respuesta) {
      return { auth: false, message: `el usuario: ${nombreUsuario} no existe` };
    }
    if (respuesta.auth) {
      const token = TokenCreate.CrearToken(respuesta.usuario._id);
      res.cookie("token", token);
    }
    res.status(200).send(respuesta);
    console.log("respuesta: ", respuesta);
  } catch (error) {
    next(error);
  }
};
//navegar
const perfil = async (req, res, next) => {
  try {
    //verificarToken;
    //throw new Error("error en perfil");
    const userid = req.userId;
    const respuesta = await servicioUser.perfil(userid);
    if (!respuesta) {
      res.status(400).send({ message: "usuario no encontrado" });
    }

    res.status(200).send({ status: "ok", data: respuesta });
  } catch (error) {
    next(error);
    // res.send({ status: "failed", data: { error: error.message } || error });
  }
};
const verificarToken = async (req, res, next) => {
  try {
    const userid = req.userId;
    const respuesta = await servicioUser.perfil(userid);
    if (!respuesta) {
      res.status(400).send({ message: "usuario no encontrado" });
    }

    res.status(200).send({ auth: true, usuario: respuesta });
  } catch (error) {
    next(error);
  }
};
const cerrarSesion = (req, res, next) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
    });
    console.log("sesion cerrada");
    res.status(200).send({ status:true });
  } catch (error) {
    next(error);
  }
};
const verificarCorreo = async (req, res, next) => {
  try {
    const { correo } = req.query; // Obtenemos el correo de los query params
    
    if (!correo) {
      return res.status(400).json({ error: "El parámetro 'correo' es requerido" });
    }

    const existe = await servicioUser.verificarCorreo(correo);
    res.status(200).json({ existe });
  } catch (error) {
    next(error);
  }
};

const solicitarRecuperacion = async (req, res) => {
  try {
    const { correo } = req.query;
    
    const usuario = await userModel.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    usuario.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex'); 
    usuario.resetPasswordExpires = Date.now() + 3600000; 
    await usuario.save();

    await PasswordService.sendResetEmail(correo, token);

    res.status(200).json({ 
      message: 'Correo de recuperación enviado',
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaPassword } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const usuario = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!usuario) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    usuario.password = nuevaPassword;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;
    await usuario.save();

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, registrarse, perfil, cerrarSesion,verificarToken,verificarCorreo,solicitarRecuperacion,resetPassword };