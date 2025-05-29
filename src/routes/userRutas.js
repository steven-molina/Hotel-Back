const express = require("express");
const userController =require("../controllers/ControllerUser");
// import all controllers
// import SessionController from './app/controllers/SessionController';
const verificar = require("../middlewares/VerificarToken");
const routes = express.Router();

// Add routes
routes.post("/registrarse", userController.registrarse);
routes.post("/login", userController.login);
routes.post("/logout",verificar.verificarToken, userController.cerrarSesion);

routes.get("/miperfil", verificar.verificarToken, (req, res) => {
  res.json({
      message: 'Perfil de usuario',
      userRol: req.userRol
  });
});

routes.get("/verificar",verificar.verificarToken, userController.verificarToken);

routes.get("/verificarcorreo", userController.verificarCorreo);

routes.get('/solicitar-recuperacion', userController.solicitarRecuperacion);
routes.post('/reset-password/:token', userController.resetPassword);

routes.get('/verificar', verificar.verificarToken, (req, res) => {
  res.status(200).json({
    auth: true,
    message: 'Token válido',
    id: req.userId,
    rol: req.userRol,
    usuario: req.userUsuario
  });
});


module.exports = routes;
