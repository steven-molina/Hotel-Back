const express = require("express");
// import all controllers
const controller = require("../controllers/ControllerHabitacion");
const verificar = require("../middlewares/VerificarToken");

const routes = express.Router();

// Agrega esto cerca de los otros middlewares
const multer = require('multer');
const storage = multer.memoryStorage(); // Almacena los archivos en memoria como Buffers
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  }
});

// Add routes
routes.get("/habitaciones", controller.getAllHabitaciones);

routes.get("/habitaciones/:id", controller.getOneHabitacion);

routes.post(
  "/habitaciones",
  verificar.verificarToken,
  verificar.esAdmin,
  upload.array('imagen'), // Acepta múltiples archivos
  controller.createHabitacion
);

routes.put("/habitaciones/:id", verificar.verificarToken, verificar.esAdmin, controller.updateHabitacion);

routes.delete("/habitaciones/:id", verificar.verificarToken, verificar.esAdmin,  controller.deleteHabitacion);

module.exports = routes;
//prueba