class CustomAPIError extends Error {
  constructor(msg) {
    super(msg);
  }
}

module.exports = CustomAPIError;
