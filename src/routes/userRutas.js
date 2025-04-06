const express = require("express");
const userController =require("../controllers/ControllerUser");
// import all controllers
// import SessionController from './app/controllers/SessionController';
const verificar = require("../middlewares/VerificarToken");
const routes = express.Router();

// Add routes
routes.post("/registrarse", userController.registrarse);
routes.post("/login", userController.login);
routes.post("/logout", userController.cerrarSesion);
routes.get("/miperfil",verificar.verificarToken, userController.perfil);
routes.get("/verificar",verificar.verificarToken, userController.verificarToken);

routes.get("/verificarcorreo", userController.verificarCorreo);
routes.get('/solicitar-recuperacion', userController.solicitarRecuperacion);
// Ejemplo de ruta para procesar el reset:
routes.post('/reset-password/:token', userController.resetPassword);

//actualizar:


// routes.get("/prueba",verificar.verificarToken,(req,res)=>{
//     res.send("reseñas")
// })
// routes.put('/', SessionController.store);
// routes.delete('/', SessionController.store);

module.exports = routes;
