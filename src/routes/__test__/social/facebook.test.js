import app from "../../..";
import request from "supertest";
import { testFlags } from "../../../middleware/__test__/testSettings";

describe("Facebook authentication", () => {
  beforeEach(() => {
    testFlags.disableFacebook = false;
    testFlags.disableGoogle = false;
    testFlags.disableGithub = false;
    testFlags.disableTwitter = false;
  });

  it("should return a successful response", async () => {
    const res = await request(app).get("/social/facebook");
    expect(res.status).toBe(200);
    expect(res.body.data.authenticationUrl).toMatch(
      "https://www.facebook.com/v4.0/dialog/oauth"
    );
  });

  it("should return a 401 response", async () => {
    testFlags.disableFacebook = true;

    const res = await request(app).get("/social/facebook");
    expect(res.status).toBe(401);
  });
});
