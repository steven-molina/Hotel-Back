const express = require("express");
// import all controllers
const controller = require("../controllers/ControllerSolicitud");
const verificar = require("../middlewares/VerificarToken");

const routes = express.Router();
// Add routes
routes.get("/solicitudes", verificar.verificarToken,controller.getAllServicios);

routes.get("/solicitudes/:id", verificar.verificarToken, controller.getOneServicio);

routes.post("/solicitudes", verificar.verificarToken,verificar.esUsuario, controller.createServicio);

routes.delete("/solicitudes/:idHuesped/:idServicio", verificar.verificarToken,verificar.esUsuario,verificar.esAdmin,
      controller.deleteServicio);

module.exports = routes;