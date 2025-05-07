const servicesolicitud = require("../services/ServicioSolicitud");
const getAllSolicitudes = async (req, res) => {
  try {
    const solicitudes = await servicesolicitud.getAllSolicitudes();
    res.json({solicitudes})
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const getOneSolicitud = async (req, res) => {
    try {
      const searchTerm = req.params.id; // Puede ser idHuesped o idServicio
      const solicitud = await servicesolicitud.getOneSolicitud(searchTerm);
      res.status(200).json({ status: "OK", data: solicitud });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ 
          status: "FAILED", 
          data: { error: error.message || error } 
        });
    }
  };
const createSolicitud = async (req, res) => {
  try {
    const { idServicio, idHuesped, Cantidad } = req.body;
    const nuevaSolicitud = {
      idServicio,
      idHuesped,
      Cantidad
    };

    const createdSolicitud = await servicesolicitud.createSolicitud(nuevaSolicitud);
    res.status(201).json({ status: "OK", data: createdSolicitud })
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const deleteSolicitud = async (req, res) => {
  try {
    const { idHuesped, idServicio } = req.params;
    
    if (!idHuesped || !idServicio) {
      throw {
        status: 400,
        message: "Se requieren ambos parámetros: idHuesped e idServicio"
      };
    }

    const result = await servicesolicitud.deleteSolicitud(idHuesped, idServicio);
    res.status(200).json({ 
      status: "OK", 
      data: { 
        message: "Solicitud eliminada correctamente",
        details: result
      } 
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
module.exports = {
  getAllSolicitudes,
  getOneSolicitud,
  createSolicitud,
  deleteSolicitud,
};