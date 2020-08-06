export default class CustomError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class InternalServerError extends CustomError {
  constructor(error) {
    console.log(error);
    super(500, "Something went wrong, please try again later.");
  }
}
