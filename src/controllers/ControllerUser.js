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
    const { identificacion,nombreUsuario, correo, password, rol } = req.body;
    const userExiste = await servicioUser.verificarUserName(nombreUsuario);
    if (userExiste) {
      return res
        .status(400)
        .json({ mensaje: ["el nombre de usuario ya existe"] });
    }
   
    const usuario = {
      identificacion,
      nombreUsuario,
      correo,
      password, 
    };

    const usernuevo = new userModel(usuario);
    usernuevo.password = await usernuevo.ocultar(password);

    const usuarioGuardado = await servicioUser.registrarse(usernuevo);
    
    const token = await TokenCreate.CrearToken(usuarioGuardado._id, usuarioGuardado.rol);
    
    res.cookie("token", token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict'
    });

    return res.status(201).json({
      auth: true,
      token,
      usuario: {
        id: usuarioGuardado._id,
        nombreUsuario: usuarioGuardado.nombreUsuario,
        correo: usuarioGuardado.correo,
        rol: usuarioGuardado.rol,
        identificacion: usuarioGuardado.identificacion
      }
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajesError = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ mensaje: mensajesError });
    }
    if (error.code === 11000) {
      const campoDuplicado = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        mensaje: [`El ${campoDuplicado} ya está registrado`] 
      });
    }
    next(error);
  }
};
//iniciar sesion
const login = async (req, res, next) => {
  try {
    const { nombreUsuario, password } = req.body;
    const usuario = await userModel.findOne({ nombreUsuario });
    
    if (!usuario) {
      return res.status(200).json({ 
        auth: false,
        message: 'Usuario no encontrado' 
      });
    }
    const contraseñaValida = await usuario.validarPassword(password);
    if (!contraseñaValida) {
      return res.status(200).json({ 
        auth: false,
        message: 'Contraseña incorrecta' 
      });
    }

    const token = TokenCreate.CrearToken(usuario._id, usuario.rol);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true en producción
      sameSite: 'none', // Importante para cross-site
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });
    return res.status(200).json({
      auth: true,
      usuario: {
        nombreUsuario: usuario.nombreUsuario,
        rol: usuario.rol,
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(200).json({ 
      auth: false,
      message: 'Error en el servidor' 
    });
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
    usuario.password = await usuario.ocultar(nuevaPassword);
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;
    await usuario.save();

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, registrarse, perfil, cerrarSesion,verificarToken,verificarCorreo,solicitarRecuperacion,resetPassword };
