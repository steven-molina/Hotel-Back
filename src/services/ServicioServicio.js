const dbServicio = require("../database/servicioQuery");
const getAllServicios = async () => {
  try {
    
    const servicios = await dbServicio.getAllServicios();
    return servicios;
  } catch (error) {
    throw error;
  }
};
const getOneServicio = async (id) => {
  try {
    const servicio = await dbServicio.getOneServicio(id);
    return servicio;
  } catch (error) {
    throw error;
  }
};
const createServicio = async (nuevoService) => {
  try {
    const respuesta = await dbServicio.createServicio(nuevoService);

    return respuesta;
  } catch (error) {
    throw error;
  }
};
const updateServicio = async (id, body) => {
  try {
    const respuesta = await dbServicio.updateServicio(id, body);
    return respuesta;
  } catch (error) {
    throw error;
  }
};
const deleteServicio = async (id) => {
  try {
    const respuesta = await dbServicio.deleteServicio(id);
    return respuesta;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllServicios,
  createServicio,
  getOneServicio,
  updateServicio,
  deleteServicio,
};
