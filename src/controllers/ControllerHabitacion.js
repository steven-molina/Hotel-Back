const servicioHabitacion = require("../services/ServicioHabitacion");
const getAllHabitaciones = async (req, res) => {
  try {
    const habitaciones = await servicioHabitacion.getAllHabitaciones();
    res.json({habitaciones})
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const getOneHabitacion = async (req, res) => {
  try {
    const id = req.params.id;
    const oneUser = await servicioHabitacion.getOneHabitacion(id);
    res.status(200).send({ status: "OK", data: oneUser });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const createHabitacion = async (req, res) => {
  try {
    const {identificador, nombre, imagen, descripcion,capacidad,caracteristicas,precio } = req.body;
     // Convertir imágenes a Base64 si vienen como archivos
    let imagenesBase64 = [];
    if (req.files?.imagen) {
      const files = Array.isArray(req.files.imagen) ? req.files.imagen : [req.files.imagen];
      for (const file of files) {
        const base64 = file.buffer.toString('base64');
        imagenesBase64.push(`data:${file.mimetype};base64,${base64}`);
      }
    } else if (Array.isArray(imagen)) {
      imagenesBase64 = imagen;
    }
    
    const habitacionNueva = {
      identificador,
      nombre,
      imagen: imagenesBase64,
      descripcion,
      capacidad,
      caracteristicas: Array.isArray(caracteristicas) ? caracteristicas : [caracteristicas],
      precio
    };
    console.log("----Habitacion--:", habitacionNueva);
    const crearHabitacion = await servicioHabitacion.createHabitacion(habitacionNueva);
    res.status(201).send({ status: "OK", data: crearHabitacion });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const updateHabitacion = async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;
    const respuesta = await servicioHabitacion.updateHabitacion(id, body);
    res
      .status(200)
      .send({ status: "habitacion actualizada: " + body.nombre, data: respuesta });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const deleteHabitacion = async (req, res) => {
  try {
    const id = req.params.id;
    const respuesta = await servicioHabitacion.deleteHabitacion(id);
    res
      .status(200)
      .send({ status: "Habitacion ELiminado" + id, data: respuesta });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
module.exports = {
  getAllHabitaciones,
  getOneHabitacion,
  createHabitacion,
  updateHabitacion,
  deleteHabitacion,
};