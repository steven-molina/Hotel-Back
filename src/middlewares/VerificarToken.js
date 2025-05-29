const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
//MIDDLEWARES
dotenv.config();
const verificarToken = async (req, res, next) => {

  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  console.log(token);
  if (!token) {
    return res
      .status(400)
      .json({ auth: false, message: "no tiene token (permiso)" });
  }

  const decoded = jwt.decode(token);
  const now = Date.now();

  let infoTiempo = {};
  if (decoded && decoded.exp) {
    const exp = decoded.exp * 1000; // JWT usa segundos, convertimos a ms
    const tiempoRestanteMs = exp - now;
    infoTiempo = {
      horaActual: new Date(now).toISOString(),
      expiracionToken: new Date(exp).toISOString(),
      tiempoRestanteSegundos: Math.max(Math.floor(tiempoRestanteMs / 1000), 0),
      tiempoRestanteLegible:
        tiempoRestanteMs > 0
          ? `${Math.floor(tiempoRestanteMs / 60000)} minutos`
          : "Expirado"
    };
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // 🔍 Manejo detallado de errores comunes
      let mensaje = "Token inválido";

      switch (err.name) {
        case "TokenExpiredError":
          mensaje = "Token expirado";
          res.clearCookie('token', {
            path: '/',
            domain: process.env.COOKIE_DOMAIN || 'localhost'
          });
          break;
        case "JsonWebTokenError":
          mensaje = "Token mal formado o manipulado";
          break;
        case "NotBeforeError":
          mensaje = "Token no está activo aún";
          break;
        default:
          mensaje = "Error de autenticación";
          break;
      }

      return res.status(403).json({
        auth: false,
        message: mensaje,
        detalle: err.message,
        ...infoTiempo
      });
    }
    req.userId = user.id;
    req.userRol = user.rol;
    req.userUsuario = user.usuario;
    console.log(user);
    next();
  });
};

const esAdmin = (req, res, next) => {
  if (req.userRol !== 'administrador') {
    return res.status(403).json({
      message: 'Acceso denegado: Se requiere rol de administrador'
    });
  }
  next();
};

const esUsuario = (req, res, next) => {
  if (req.userRol !== 'usuario') {
    return res.status(403).json({
      message: 'Acceso denegado: Se requiere rol de usuario'
    });
  }
  next();
};

const esPropietarioOAdmin = (req, res, next) => {
  if (req.userRol === 'administrador') {
    return next();
  }

  if (req.userId !== req.params.id) {
    return res.status(403).json({
      message: 'Acceso denegado: Solo puede modificar sus propios recursos'
    });
  }

  next();
};
module.exports = { verificarToken, esAdmin, esUsuario, esPropietarioOAdmin };
