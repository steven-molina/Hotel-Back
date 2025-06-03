const express = require("express");
// import all controllers
const controller = require("../controllers/ControllerReserva");
const { verificarToken, esAdmin, esUsuario, esPropietarioOAdmin } = require("../middlewares/VerificarToken");
const routes = express.Router();

// Add routes
routes.get("/reservas",verificarToken, esAdmin,controller.getAllReservas);
routes.get("/reservasuser/:identificador",verificarToken, esUsuario, controller.getReservasUser);
routes.get("/reservas/:identificador", verificarToken, esAdmin, controller.getOneReserva);
routes.post("/createreserva",verificarToken, controller.createReserva);
routes.put("/reserva/:identificador", verificarToken,controller.updateReserva);
routes.delete("/reservas/:identificador",verificarToken, controller.deleteReserva);

module.exports = routes;