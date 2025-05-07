const express = require("express");
// import all controllers
const controller = require("../controllers/ControllerSolicitud");
const verificar = require("../middlewares/VerificarToken");

const routes = express.Router();
// Add routes
routes.get("/solicitudes", verificar.verificarToken,controller.getAllSolicitudes);

routes.get("/solicitudes/:id", verificar.verificarToken, controller.getOneSolicitud);

routes.post("/solicitudes", verificar.verificarToken,verificar.esUsuario, controller.createSolicitud);

routes.delete("/solicitudes/:idHuesped/:idServicio", verificar.verificarToken,verificar.esUsuario,verificar.esAdmin,
      controller.deleteSolicitud);

module.exports = routes;