const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
//MIDDLEWARES
dotenv.config();
const verificarToken = async (req, res, next) => {

  const { token } = req.cookies;
  console.log(token);
  if (!token) {
    return res
      .status(400)
      .json({ auth: false, message: "no tiene token (permiso)" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "token invalido" });
    req.userId = user.id;
    req.userRol = user.rol;
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
module.exports = { verificarToken, esAdmin,esUsuario,esPropietarioOAdmin };
