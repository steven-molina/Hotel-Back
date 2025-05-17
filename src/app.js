
require('dotenv').config();
const express = require("express");
const rutaUser = require("./routes/userRutas");
const rutaHabitacion = require("./routes/habitacionRutas")
const rutaServicio = require("./routes/servicioRutas")
//const rutaResena = require("./routes/resenaRutas")
//const rutaEmpleado = require("./routes/empleadoRutas")
const  rutaReserva=require("./routes/reservasRutas")
const rutaSolicitud = require("./routes/solicitudRutas")
const rutaPago = require("./routes/pagoRutas")
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/api", rutaUser);
app.use("/api", rutaHabitacion);
app.use("/api", rutaServicio);
app.use("/api", rutaPago);
//app.use("/api", rutaResena);
//app.use("/api", rutaEmpleado);
app.use("/api", rutaReserva);
app.use("/api", rutaSolicitud);
app.use(require("./middlewares/Errores").ManejoError);
module.exports = app;
