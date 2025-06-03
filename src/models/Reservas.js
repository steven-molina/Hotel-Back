const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    usuarioId: {  // Añadir referencia explícita al usuario
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    identificador: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    habitacion: {  // Cambiar a objeto para más detalles
      nombre: { type: String, required: true },
      id: { type: mongoose.Schema.Types.ObjectId, required: true,ref: "habitaciones" },
      precio: { type: Number, required: true }
    },
    fechas: {
      ingreso: { type: Date, required: true },
      salida: { type: Date, required: true },
      noches: { type: Number, required: true }  // Añadir campo calculado
    },
    huespedes: {
      adultos: { type: Number, required: true, min: 1 },
      niños: { type: Number, default: 0 }

    },
    contacto: {
      nombre: { type: String, required: true },
      apellido: { type: String },
      email: { type: String, required: true },
      telefono: { type: String, required: true }
    },
    pago: {
      metodo: { 
        type: String, 
        enum: ['tarjeta', 'transferencia', 'efectivo'], 
        required: true 
      },
      detalles: { type: mongoose.Schema.Types.Mixed }, // Flexible para diferentes métodos
      monto: { type: Number, required: true },
      estado: { type: String, enum: ['pendiente', 'completado', 'fallido'], default: 'pendiente' },
      fechaPago: { type: Date }
    },
    estado: { 
      type: String, 
      enum: ['pendiente', 'confirmada', 'cancelada', 'completada'], 
      default: 'pendiente' 
    },
    total: { type: Number, required: true }
  },
  { timestamps: true, versionKey: false }
);

const reservasModel = mongoose.model("reservas", reservaSchema);
module.exports = reservasModel;