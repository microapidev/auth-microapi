import app from "../../..";
import request from "supertest";
import { testFlags } from "../../../middleware/__test__/testSettings";

// Authentication URL.
let testCallbackUrl =
  "/social/authCallback?success=true&id=106257712146027420454&isVerified=true&firstname=Allistair&lastname=Vilakazi&username=allistair.vilakazi%40gmail.com&email=allistair.vilakazi%40gmail.com&photo=https%3A%2F%2Flh3.googleusercontent.com%2Fa-%2FAOh14GiygoCTW6KQa09vGR7zofMtGEE6YB9_ALO1EMxNMA#";

describe("Google authentication", () => {
  beforeEach(() => {
    testFlags.disableFacebook = false;
    testFlags.disableGoogle = false;
    testFlags.disableGithub = false;
    testFlags.disableTwitter = false;
  });

  it("should return a successful response", async () => {
    const res = await request(app).get("/social/google");
    expect(res.status).toBe(200);
    expect(res.body.data.authenticationUrl).toMatch(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );
  });

  it("should make a success callback after authentication", async () => {
    const res = await request(app).get(testCallbackUrl);
    expect(res.status).toBe(200);
  });

  it("should return a 401 response", async () => {
    testFlags.disableGoogle = true;

    const res = await request(app).get("/social/google");
    expect(res.status).toBe(401);
  });

  it("should return a 500 error", async () => {
    const res = await request(app).get(
      "/social/google/callback?state=justastring&code=justanotherstring"
    );
    expect(res.status).toBe(500);
  });
});
