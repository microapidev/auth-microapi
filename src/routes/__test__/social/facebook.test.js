import app from "../../..";
import request from "supertest";
import { testFlags } from "../../../middleware/__test__/testSettings";

// Authentication URL.
let testCallbackUrl =
  "/social/authCallback?success=true&id=375612282&isVerified=false&firstname=Allistair&lastname=Vilakazi&username=375612282&email=&photo=http%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F378800000629602434%2Fc6e96888c20267d9eb13846b3f23d70d_normal.jpeg";

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

  it("should make a success callback after authentication", async () => {
    const res = await request(app).get(testCallbackUrl);
    expect(res.status).toBe(200);
  });

  it("should return a 401 response", async () => {
    testFlags.disableFacebook = true;

    const res = await request(app).get("/social/facebook");
    expect(res.status).toBe(401);
  });

  it("should return a 500 error", async () => {
    const res = await request(app).get(
      "/social/facebook/callback?state=justastring&code=justanotherstring"
    );
    expect(res.status).toBe(500);
  });
});
