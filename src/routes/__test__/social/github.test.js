import app from "../../..";
import request from "supertest";
import { testFlags } from "../../../middleware/__test__/testSettings";

// Authentication URL.
let testCallbackUrl =
  "/social/authCallback?success=true&id=45206423&isVerified=false&firstname=Allistair&lastname=Vilakazi&username=simply-alliv&email=&photo=https%3A%2F%2Favatars3.githubusercontent.com%2Fu%2F45206423%3Fv%3D4";

describe("GitHub authentication", () => {
  beforeEach(() => {
    testFlags.disableFacebook = false;
    testFlags.disableGoogle = false;
    testFlags.disableGithub = false;
    testFlags.disableTwitter = false;
  });

  it("should return a successful response", async () => {
    const res = await request(app).get("/social/github");
    expect(res.status).toBe(200);
    expect(res.body.data.authenticationUrl).toMatch(
      "https://github.com/login/oauth/authorize"
    );
  });

  it("should make a success callback after authentication", async () => {
    const res = await request(app).get(testCallbackUrl);
    expect(res.status).toBe(200);
  });

  it("should return a 401 response", async () => {
    testFlags.disableGithub = true;

    const res = await request(app).get("/social/github");
    expect(res.status).toBe(401);
  });

  it("should return a 500 error", async () => {
    const res = await request(app).get(
      "/social/github/callback?state=justastring&code=justanotherstring"
    );
    expect(res.status).toBe(500);
  });
});
