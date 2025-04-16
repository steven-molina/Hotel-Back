const express = require("express");
// import all controllers
const controller = require("../controllers/ControllerReserva");
const { verificarToken, esAdmin, esUsuario, esPropietarioOAdmin } = require("../middlewares/VerificarToken");
const routes = express.Router();

// Add routes
routes.get("/reservas",verificarToken, esAdmin,controller.getAllReservas);
routes.get("/reservasuser/:id",verificarToken, esUsuario, controller.getReservasUser);
routes.get("/reservas/:id", verificarToken, esAdmin, controller.getOneReserva);
routes.post("/createreserva",verificarToken, esPropietarioOAdmin, controller.createReserva);
routes.put("/reserva/:id", verificarToken, esAdmin,controller.updateReserva);
routes.delete("/reservas/:id",verificarToken, esPropietarioOAdmin, controller.deleteReserva);

module.exports = routes;