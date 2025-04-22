const serviceservicio = require("../services/ServicioServicio");
const getAllServicios = async (req, res) => {
  try {
    const services = await serviceservicio.getAllServicios();
    res.json({services})
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const getOneServicio = async (req, res) => {
  try {
    const id = req.params.id;
    const oneServicio = await serviceservicio.getOneServicio(id);
    res.status(200).send({ status: "OK", data: oneServicio });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const createServicio = async (req, res) => {
  try {
    const {identificador, nombre, imagen, descripcion,capacidad,categoria,precio } = req.body;
    const ServicioNuevo = {
      identificador,
      nombre,
      imagen,
      descripcion,
      capacidad,
      categoria,
      precio
    };
    console.log("----Servicio--:", ServicioNuevo);
    const crearServicio= await serviceservicio.createServicio(ServicioNuevo);
    res.status(201).send({ status: "OK", data: crearServicio });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const updateServicio = async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;
    const respuesta = await serviceservicio.updateServicio(id, body);
    res
      .status(200)
      .send({ status: "Servicio actualizado: " + body.nombre, data: respuesta });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const deleteServicio = async (req, res) => {
  try {
    const id = req.params.id;
    const respuesta = await serviceservicio.deleteServicio(id);
    res
      .status(200)
      .send({ status: "Servicio Eliminado " + id, data: respuesta });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
module.exports = {
  getAllServicios,
  getOneServicio,
  createServicio,
  updateServicio,
  deleteServicio,
};