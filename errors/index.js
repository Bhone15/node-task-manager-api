const CustomAPIError = require("./CustomAPIError");
const UnauthenticatedError = require("./Unauthenticated");
const NotFoundError = require("./Not-found");
const BadRequestError = require("./BadRequest");
const UnauthorizedError = require("./Unauthorized");

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
};
