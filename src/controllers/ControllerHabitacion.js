const servicioHabitacion = require("../services/ServicioHabitacion");
const getAllHabitaciones = async (req, res) => {
  try {
    const habitaciones = await servicioHabitacion.getAllHabitaciones();
    res.json({ habitaciones })
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ status: "failed", data: { error: error.message || error } });
  }
};
const getOneHabitacion = async (req, res) => {
  try {
    const identificador = req.params.identificador;
    const oneUser = await servicioHabitacion.getOneHabitacion(identificador);
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
    // Procesar archivos subidos
    if (req.files && req.files.length > 0) {
      const imagenesSubidas = req.files.map(file =>
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      );
      imagenes = imagenes.concat(imagenesSubidas);
    }

    // Procesar URLs desde frontend
    if (req.body.existingImages) {
      const urls = JSON.parse(req.body.existingImages);
      if (Array.isArray(urls)) {
        imagenes = imagenes.concat(urls);
      }
    }
    
    let parsedCaracteristicas;
    try {
      parsedCaracteristicas = typeof caracteristicas === 'string'
        ? JSON.parse(caracteristicas)
        : caracteristicas;
    } catch {
      parsedCaracteristicas = [];
    }
    const habitacionNueva = {
      identificador,
      nombre,
      imagen: imagenes,
      descripcion: descripcion || '',
      capacidad: Number(capacidad),
      caracteristicas: Array.isArray(parsedCaracteristicas)
        ? parsedCaracteristicas
        : [parsedCaracteristicas],
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
    const identificador = req.params.identificador;
    const respuesta = await servicioHabitacion.updateHabitacion(identificador, body);
    
    // Obtener la habitación actualizada para devolverla
    const habitacionActualizada = await servicioHabitacion.getOneHabitacion(identificador);
    
    res.status(200).send({ 
      status: "habitacion actualizada: " + habitacionActualizada.nombre, 
      data: habitacionActualizada,
      message:respuesta
    });
  } catch (error) {
    res.status(error.status || 500).send({ 
      status: "failed", 
      data: { error: error.message || error } 
    });
  }
};
const deleteHabitacion = async (req, res) => {
  try {
    const identificador = req.params.identificador;
    const respuesta = await servicioHabitacion.deleteHabitacion(identificador);
    res
      .status(200)
      .send({ status: "Habitacion ELiminado" + identificador, data: respuesta });
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