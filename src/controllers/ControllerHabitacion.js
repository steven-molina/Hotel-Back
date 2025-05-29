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
    const { nombre, descripcion, capacidad, caracteristicas, precio } = req.body;
    const identificador = req.params.identificador;

    if (!nombre || precio <= 0) {
      throw {
        status: 400,
        message: "Datos inválidos: nombre y precio son requeridos"
      };
    }

    let imagenes = [];
    if (req.files?.length > 0) {
      imagenes = req.files.map(file => 
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      );
    }
    if (req.body.existingImages) {
      const urls = JSON.parse(req.body.existingImages);
      if (Array.isArray(urls)) {
        imagenes = [...imagenes, ...urls];
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

    const updateData = {
      nombre,
      ...(imagenes.length > 0 && { imagen: imagenes }),
      descripcion: descripcion || '',
      capacidad: Number(capacidad),
      caracteristicas: Array.isArray(parsedCaracteristicas) 
        ? parsedCaracteristicas 
        : [parsedCaracteristicas],
      precio: Number(precio)
    };

    console.log("Datos para actualizar:", updateData);

    const respuesta = await servicioHabitacion.updateHabitacion(identificador, updateData);
    const habitacionActualizada = await servicioHabitacion.getOneHabitacion(identificador);

    res.status(200).send({ 
      status: "habitacion actualizada: " + habitacionActualizada.nombre, 
      data: habitacionActualizada, // Corregido el typo
      message: respuesta
    });
  } catch (error) {
    console.error("Error en updateHabitacion:", error);
    res.status(error.status || 500).send({
      status: "failed",
      data: { 
        error: error.message || error,
        debugData
      }
    });
  }
};
const deleteHabitacion = async (req, res) => {
  try {
    const identificador = req.params.identificador;
    const respuesta = await servicioHabitacion.deleteHabitacion(identificador);

    // Verifica la estructura real de respuesta de tu servicio
    console.log("Respuesta del servicio:", respuesta);

    // Asegúrate de devolver un formato consistente
    res.status(200).send({ 
      status: "Habitación eliminada: " + identificador,
      deletedCount: respuesta.deletedCount || (respuesta.acknowledged ? 1 : 0),
      data: respuesta
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(error.status || 500).send({
      status: "failed",
      data: { 
        error: error.message || error,
        deletedCount: 0
      }
    });
  }
};
module.exports = {
  getAllHabitaciones,
  getOneHabitacion,
  createHabitacion,
  updateHabitacion,
  deleteHabitacion,
};