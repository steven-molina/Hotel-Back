const express = require("express");
const controller = require("../controllers/ControllerHabitacion");
const verificar = require("../middlewares/VerificarToken");

const routes = express.Router();


const multer = require('multer');
const storage = multer.memoryStorage(); 
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

routes.get("/habitaciones/:identificador", controller.getOneHabitacion);

routes.post(
  "/habitaciones",
  verificar.verificarToken,
  verificar.esAdmin,
  upload.array('imagen'),
  controller.createHabitacion
);

routes.put("/habitaciones/:identificador", verificar.verificarToken, verificar.esAdmin, controller.updateHabitacion);

routes.delete("/habitaciones/:identificador", verificar.verificarToken, verificar.esAdmin,  controller.deleteHabitacion);

module.exports = routes;
//prueba