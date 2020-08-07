export default class CustomError extends Error {
  constructor(statusCode, message, errors) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}

export class InternalServerError extends CustomError {
  constructor(error) {
    console.log(error);
    super(500, "Something went wrong, please try again later.");
  }
}
