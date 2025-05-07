const mongoose = require("mongoose");

const solicitudSchema = new mongoose.Schema(
  {
    idServicio: {
      type: String,
      required: true,
      trim: true,
    },
    idHuesped: {
      type: String,
      required: true,
      trim: true,
    },
    Cantidad: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);
const solicitudModel = mongoose.model("solicitud", solicitudSchema);
module.exports = solicitudModel;