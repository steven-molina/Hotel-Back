const express = require("express");
// import all controllers
const controller = require("../controllers/ControllerServicio");
const verificar = require("../middlewares/VerificarToken");

const routes = express.Router();
// Add routes
routes.get("/servicios", controller.getAllServicios);

routes.get("/servicios/:id", controller.getOneServicio);

routes.post("/servicios",verificar.verificarToken,  controller.createServicio);

routes.put("/servicios/:id", verificar.verificarToken, controller.updateServicio);

routes.delete("/servicios/:id", verificar.verificarToken,  controller.deleteServicio);

module.exports = routes;
//prueba