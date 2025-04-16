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
    const identificador = req.params.id;
    console.log("identif",typeof identificador);
    const reservas = await servicioReserva.getReservasUser(identificador.toString());
    res.json(reservas)
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
    if (!req.userId) {
      return res.status(401).json({ 
        status: "FAILED",
        message: "No autenticado. Por favor inicie sesión." 
      });
    }
    const { identificador, reservas, contacto,pago,precio } = req.body;
    const reservaNueva = {
      identificador,
      reservas,
      contacto,
      pago,
      precio,
      usuarioId: req.userId,  
      creadoPor: req.userRol 
    };
    console.log("----reserva--:", reservaNueva);
    const crearReserva = await servicioReserva.createReserva(reservaNueva);
    const responseData = {
      identificador: crearReserva.identificador,
      precio: crearReserva.precio,
      estado: crearReserva.estado,
      fechaCreacion: crearReserva.createdAt
    };
    res.status(201).json({ 
      status: "OK", 
      message: "Reserva creada exitosamente",
      data: responseData
    });
  } catch (error) {
    console.error("Error al crear reserva:", error);
    if (error.message.includes("duplicado")) {
      return res.status(409).json({
        status: "FAILED",
        message: "El identificador de reserva ya existe"
      });
    }
    res.status(500).json({ 
      status: "FAILED",
      message: "Error interno al procesar la reserva",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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