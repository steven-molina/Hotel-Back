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
  // Preparamos un objeto para registrar datos relevantes
  const debugData = {
    body: req.body,
    files: req.files ? req.files.map(f => ({
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size
    })) : null,
    existingImages: req.body.existingImages ? JSON.parse(req.body.existingImages) : null
  };

  try {
    const { identificador, nombre, descripcion, capacidad, caracteristicas, precio } = req.body;
    
    // Validación básica
    if (!nombre || !identificador || precio <= 0) {
      const errorData = {
        message: "Datos inválidos: nombre, identificador y precio son requeridos",
        receivedData: {
          nombre,
          identificador,
          precio
        },
        debugData
      };
      console.error("Error de validación:", errorData);
      throw { 
        status: 400, 
        ...errorData 
      };
    }

    // Procesar imágenes
    let imagenes = [];
    try {
      if (req.files?.imagen) {
        imagenes = req.files.imagen.map(file => 
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        );
      } else if (req.body.existingImages) {
        imagenes = JSON.parse(req.body.existingImages);
      }
    } catch (error) {
      console.error("Error procesando imágenes:", error);
      throw {
        status: 400,
        message: "Error procesando imágenes",
        imageError: error.message,
        debugData
      };
    }

    const habitacionNueva = {
      identificador,
      nombre,
      imagen: imagenes,
      descripcion: descripcion || '',
      capacidad: Number(capacidad),
      caracteristicas: Array.isArray(caracteristicas) ? caracteristicas : [caracteristicas],
      precio: Number(precio),
      estado: "disponible"
    };

    console.log("Datos a guardar:", habitacionNueva);
    
    const crearHabitacion = await servicioHabitacion.createHabitacion(habitacionNueva);
    
    res.status(201).send({ 
      status: "OK", 
      data: crearHabitacion 
    });

  } catch (error) {
    console.error("Error en createHabitacion:", error);
    
    const errorResponse = {
      status: "FAILED",
      error: {
        message: error.message || "Error al crear la habitación",
        details: error.details || null,
        receivedData: {
          body: req.body,
          filesInfo: req.files ? `Recibidos ${req.files.length} archivos` : null
        },
        debugData,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    };

    res.status(error.status || 500).send(errorResponse);
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