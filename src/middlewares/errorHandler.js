/**
 * This middleware returns response when client tries to access unknown routes through this domain, and handles error responses sent to client when a transaction fails or throws an error
**/

const CustomResponse = require("../utils/response");

const unknownRoutes = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "ValidationError") {
    response
      .status(400)
      .json(
        CustomResponse(
          "ValidationError",
          { statusCode: 422, message: error.message },
          false
        )
      );
  } else if (error.name === "SyntaxError") {
    response
      .status(401)
      .json(
        CustomResponse(
          "SyntaxError",
          { statusCode: 422, message: error.message },
          false
        )
      );
  } else if (error.name === "JsonWebTokenError") {
    response
      .status(401)
      .json(
        CustomResponse(
          "JsonWebTokenError",
          { statusCode: 401, message: error.message },
          false
        )
      );
  } else if (error.name === "CustomError") {
    response
      .status(error.status)
      .json(
        CustomResponse(
          error.message,
          { statusCode: error.status, message: error.message },
          false
        )
      );
  } else {
    console.log(error);
    response
      .status(500)
      .json(
        CustomResponse(
          "Unhandled Error",
          (error = { statusCode: 500, message: "Unhandled Error" }),
          false
        )
      );
  }
  // next(error);
};

module.exports = {
  errorHandler,
  unknownRoutes
};