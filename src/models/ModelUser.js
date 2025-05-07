const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = {
  USUARIO: 'usuario',
  ADMINISTRADOR: 'administrador'
};

const userSchema = new Schema(
  {
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    identificacion: {
      type: String,
      unique:true,
      required:true,
      trim:true,
    },
    nombreUsuario: {
      type: String,
      unique:true,
      required:true,
      trim:true,
    },
    correo: {
      type: String,
      unique:true,
      required:true,
      trim:true,
    },
    password: {
      type: String,
      required:true,
      trim:true,
    },
    rol: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USUARIO,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.isAdmin = function() {
  return this.rol === ROLES.ADMINISTRADOR;
};

//encriptand contraseña con bcryptjs
userSchema.methods.ocultar = async (contrasena) => {
  const sald = await bcrypt.genSalt(10); //codigo
  return bcrypt.hash(contrasena, sald);
};
userSchema.methods.validarPassword = function (password) {
  return bcrypt.compare(password, this.password);
};
const userModel = model("users", userSchema);
//const modelUser = mongoose.model("User", userSchema);

//verificar si el usuario es administrador


//module.exports = mongoose.model('users', userSchema);
module.exports.ROLES = ROLES;
module.exports = userModel;