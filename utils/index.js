const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt");
const createTokenUser = require("./createTokenUser");
const {
  checkPermission,
  checkProjectAccessedUser,
  checkPermissionForSubTask,
} = require("./checkPermission");
const calculateDuration = require("./calculateDuration");

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermission,
  checkProjectAccessedUser,
  checkPermissionForSubTask,
  calculateDuration,
};
