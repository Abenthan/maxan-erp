const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/auth");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de acceso requerido" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

function authorize(...permisosRequeridos) {
  return (req, res, next) => {
    if (!req.user || !req.user.permisos) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    const tienePermiso = permisosRequeridos.some((p) => req.user.permisos.includes(p));
    if (!tienePermiso) {
      return res.status(403).json({ error: "No tienes permiso para esta acción" });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
