const express = require("express");
// import all controllers
const controller = require("../controllers/ControllerServicio");
const verificar = require("../middlewares/VerificarToken");

const routes = express.Router();
// Add routes
routes.get("/servicios", verificar.verificarToken,controller.getAllServicios);

routes.get("/servicios/:id", verificar.verificarToken, controller.getOneServicio);

routes.post("/servicios", verificar.verificarToken,verificar.esAdmin, controller.createServicio);

routes.put("/servicios/:id", verificar.verificarToken,verificar.esAdmin, controller.updateServicio);

routes.delete("/servicios/:id", verificar.verificarToken,verificar.esAdmin,  controller.deleteServicio);

module.exports = routes;
//prueba