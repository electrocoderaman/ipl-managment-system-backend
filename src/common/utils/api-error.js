class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request") {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static conflict(message = "Conflict - User already exists") {
    return new ApiError(409, message);
  }

  static forbidden(message = "forbidden") {
    return new ApiError(412, message);
  }

  static notFound(message = "User not found") {
    return new ApiError(404, message);
  }

  static oversize(message = "file size is above the limit") {
    return new ApiError(413, message);
  }

  static internal(message = "internal error") {
    return new ApiError(500, message);
  }
}

export default ApiError;
