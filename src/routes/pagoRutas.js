const express = require("express");
const controller = require("../controllers/ControllerPago");
const { verificarToken, esAdmin, esUsuario } = require("../middlewares/VerificarToken");
const routes = express.Router();

routes.post("/reservas/:id/pagos", verificarToken, esUsuario,esAdmin, controller.registrarPago);

routes.get("/reservas/:id/pagos", verificarToken, esAdmin, controller.obtenerPagosReserva);

module.exports = routes;