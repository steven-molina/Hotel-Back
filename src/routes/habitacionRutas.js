const express = require("express");
// import all controllers
const controller = require("../controllers/ControllerHabitacion");
const verificar = require("../middlewares/VerificarToken");

const routes = express.Router();
// Add routes
routes.get("/habitaciones", controller.getAllHabitaciones);

routes.get("/habitaciones/:id", controller.getOneHabitacion);

routes.post("/habitaciones",verificar.verificarToken, verificar.esAdmin, controller.createHabitacion);

routes.put("/habitaciones/:id", verificar.verificarToken, verificar.esAdmin, controller.updateHabitacion);

routes.delete("/habitaciones/:id", verificar.verificarToken, verificar.esAdmin,  controller.deleteHabitacion);

module.exports = routes;
//prueba