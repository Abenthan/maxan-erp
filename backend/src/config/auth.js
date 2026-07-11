module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "maxan-erp-secret-dev",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "8h",
};
