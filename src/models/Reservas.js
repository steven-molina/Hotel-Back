const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    identificador: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    reservas: {
      fechaIngreso: { type: Date, required: true },
      fechaSalida: { type: Date, required: true },
      adultos: { type: Number, required: true },
      niños: { type: Number, required: true },
      habitacion: { type: String, required: true }
    },
    contacto: {
      nombre: { type: String, required: true },
      apellido: { type: String, required: true },
      correo: { type: String, required: true },
      telefono: { type: Number, required: true }
    },
    pago: {
      metodo: { 
        type: String, 
        enum: ['efectivo', 'tarjeta', 'transferencia'], 
        required: true 
      },
      tarjeta: {
        titular: { type: String },
        numero: { type: Number },
        fechaVencimiento: { type: Date },
        cvv: { type: Number }
      },
      transferencia: {
        referencia: { type: String },
        banco: { type: String }
      },
      montoPagado: { type: Number, required: true },
      fechaPago: { type: Date }
    },
    precioTotal: { type: Number, required: true },
    estado: { 
      type: String, 
      enum: ['pendiente', 'pagada', 'cancelada'], 
      default: 'pendiente' 
    },
    checkOutConfirmado: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

const reservasModel = mongoose.model("reservas", reservaSchema);
module.exports = reservasModel;