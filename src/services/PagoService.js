const pagosQuery = require("../database/pagosQuery");

const registrarPago = async (idReserva, datosPago) => {
  try {
    const reserva = await pagosQuery.obtenerReservaParaPago(idReserva);
    if (!reserva) {
      throw { status: 404, message: "Reserva no encontrada." };
    }
    if (reserva.estado === 'pagada') {
      throw { status: 400, message: "Reserva ya pagada." };
    }

    if (datosPago.montoPagado !== reserva.precioTotal) {
      throw { status: 400, message: "Monto incorrecto." };
    }
    const metodosValidos = ['efectivo', 'tarjeta', 'transferencia'];
    if (!metodosValidos.includes(datosPago.metodo)) {
      throw { status: 400, message: "Método de pago inválido." };
    }
    const pagoRegistrado = await pagosQuery.registrarPago(idReserva, datosPago);
    return pagoRegistrado;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registrarPago
};