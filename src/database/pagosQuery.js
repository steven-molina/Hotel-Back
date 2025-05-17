const reservasModel = require("../models/Reservas");

const obtenerReservaParaPago = async (idReserva) => {
  try {
    return await reservasModel.findOne({ identificador: idReserva });
  } catch (error) {
    throw { status: 500, message: error.message || error };
  }
};

const registrarPago = async (idReserva, datosPago) => {
  try {
    const updateData = {
      'pago.metodo': datosPago.metodo,
      'pago.montoPagado': datosPago.montoPagado,
      'pago.fechaPago': new Date(),
      'estado': 'pagada',
      'checkOutConfirmado': true
    };

    // Añadir datos específicos según el método
    if (datosPago.metodo === 'tarjeta') {
      updateData['pago.tarjeta'] = datosPago.tarjeta;
    } else if (datosPago.metodo === 'transferencia') {
      updateData['pago.transferencia'] = datosPago.transferencia;
    }

    return await reservasModel.findOneAndUpdate(
      { identificador: idReserva },
      updateData,
      { new: true }
    );
  } catch (error) {
    throw { status: 500, message: error.message || error };
  }
};

module.exports = {
  obtenerReservaParaPago,
  registrarPago
};