const pagoService = require("../services/PagoService");

const registrarPago = async (req, res) => {
  try {
    const { idReserva } = req.params;
    const datosPago = req.body;
    
    const resultado = await pagoService.registrarPago(idReserva, datosPago);
    
    res.status(200).json({
      status: "OK",
      message: "Pago registrado exitosamente",
      data: resultado
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: "FAILED",
      data: { error: error.message || error }
    });
  }
};

const obtenerPagosReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const pagos = await pagoService.obtenerPagosReserva(id);
    
    res.status(200).json({
      status: "OK",
      data: pagos
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: "FAILED",
      message: error.message || "Error al obtener los pagos"
    });
  }
};

module.exports = {
  registrarPago,
  obtenerPagosReserva
};
