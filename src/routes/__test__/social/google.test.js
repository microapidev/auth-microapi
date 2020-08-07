import app from "../../..";
import request from "supertest";
import { testFlags } from "../../../middleware/__test__/testSettings";

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

  it("should return a 401 response", async () => {
    testFlags.disableGoogle = true;

    const res = await request(app).get("/social/google");
    expect(res.status).toBe(401);
  });
});
