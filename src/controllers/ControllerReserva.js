const servicioReserva = require("../services/ServicioReserva");
const getAllReservas = async (req, res) => {
  try {
    const reservas = await servicioReserva.getAllReservas();
    res.json(reservas)
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const getReservasUser = async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const reservas = await servicioReserva.getReservasUser(usuarioId);
    res.json(reservas);
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const getOneReserva = async (req, res) => {
  try {
    const id = req.params.id;
    const oneReserva = await servicioReserva.getOneReserva(id);
    res.status(200).send({ status: "OK", data: oneReserva });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const createReserva = async (req, res) => {
  try {
    const datosRecibidos = req.body;
    console.log("➡️ Datos recibidos del front:", JSON.stringify(datosRecibidos, null, 2));


    const { habitacion, fechas, huespedes, contacto, pago, usuarioId } = req.body;
    console.log("hola")
    // Validar fechas
    if (new Date(fechas.salida) <= new Date(fechas.ingreso)) {
      return res.status(400).json({ error: "Fecha de salida debe ser posterior a ingreso" });
    }

    // Calcular total
    const noches = fechas.noches;
    const total = habitacion.precio * noches;

    const reservaData = {
      usuarioId: usuarioId,
      identificador: `RES-${Date.now()}`,
      habitacion,
      fechas: {
        ingreso: fechas.ingreso,
        salida: fechas.salida,
        noches
      },
      huespedes,
      contacto,
      pago: {
        ...pago,
        monto: total,
        estado: 'pendiente'
      },
      total,
      estado: 'pendiente'
    };
    console.log("📦 Datos listos para guardar:", JSON.stringify(reservaData, null, 2));

    const nuevaReserva = await servicioReserva.createReserva(reservaData);

    res.status(201).json({
      success: true,
      data: nuevaReserva,
      links: {
        pago: `/api/reservas/${nuevaReserva._id}/pagar`
      }
    });
  } catch (error) {
    console.error("❌ Error en createReserva:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Error interno al crear la reserva",
      detalle: error.message,
    });
  }
};
const updateReserva = async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;
    const respuesta = await servicioReserva.updateReserva(id, body);
    res
      .status(200)
      .send({ status: "Reserva actualizada: " + body.nombre, data: respuesta });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const deleteReserva = async (req, res) => {
  try {
    const id = req.params.id;
    const respuesta = await servicioReserva.deleteReserva(id);
    res
      .status(200)
      .send({ status: "Reserva eliminado " + id, data: respuesta });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
module.exports = {
  getAllReservas,
  getOneReserva,
  createReserva,
  updateReserva,
  deleteReserva,
  getReservasUser
};