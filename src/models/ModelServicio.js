const mongoose = require("mongoose");
const TipoCategoria = {
  PRODUCTOS: 'productos',
  SERVICIO: 'servicio'
};
const servicioSchema = new mongoose.Schema(
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
    capacidad: {
      type: Number,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      enum: Object.values(TipoCategoria),
      default: TipoCategoria.SERVICIO,
      required: true
    },
    precio: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);
const servicioModel = mongoose.model("servicios", servicioSchema);
module.exports = servicioModel;