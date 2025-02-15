class AppError extends Error {
  constructor() {
    super();
  }

  create(message, StatusCode, httpStatusText, data) {
    this.message = message;
    this.StatusCode = StatusCode;
    this.httpStatusText = httpStatusText;
    this.data = data;
    return this;
  }
}
module.exports = new AppError();
