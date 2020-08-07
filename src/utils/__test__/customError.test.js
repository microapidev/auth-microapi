import { InternalServerError } from "../customError";

describe("customError", () => {
  it("should return a formatted 500 error", () => {
    const error = new InternalServerError();
    expect(error.message).toEqual(
      "Something went wrong, please try again later."
    );
    expect(error.statusCode).toEqual(500);
  });
});
