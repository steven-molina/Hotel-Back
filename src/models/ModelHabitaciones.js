const mongoose = require("mongoose");
const ESTADO = {
  DISPONIBLE: 'disponible',
  OCUPADO: 'ocupado'
};
const habitacionSchema = new mongoose.Schema(
  {
    identificador: {
      type: String,
      required: true,
      trim: true,
    },
    nombre: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    imagen: {
      type: [String],
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    estado: {
      type: String,
      enum: Object.values(ESTADO),
      default: ESTADO.OCUPADO,
      required: true
    },
    capacidad: {
      type: Number,
      required: true,
      trim: true,
    },
    caracteristicas: {
      type: [String],
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);
const habitacionModel = mongoose.model("habitaciones", habitacionSchema);
module.exports = habitacionModel;
