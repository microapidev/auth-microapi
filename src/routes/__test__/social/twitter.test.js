import app from "../../..";
import request from "supertest";
import { testFlags } from "../../../middleware/__test__/testSettings";

// Authentication URL.
let testCallbackUrl =
  "/social/authCallback?success=true&id=4281211625282819&isVerified=false&firstname=Allistair&lastname=Vilakazi&username=allistair.vilakazi%40gmail.com&email=allistair.vilakazi%40gmail.com&photo=https%3A%2F%2Fplatform-lookaside.fbsbx.com%2Fplatform%2Fprofilepic%2F%3Fasid%3D4281211625282819%26height%3D200%26width%3D200%26ext%3D1599383493%26hash%3DAeRhrrwBsdhpY-gO#_=_";

describe("Twitter authentication", () => {
  beforeEach(() => {
    testFlags.disableFacebook = false;
    testFlags.disableGoogle = false;
    testFlags.disableGithub = false;
    testFlags.disableTwitter = false;
  });

  it("should return a successful response", async () => {
    const res = await request(app).get("/social/twitter");
    expect(res.status).toBe(200);
    expect(res.body.data.authenticationUrl).toMatch(
      "https://api.twitter.com/oauth/authenticate"
    );
  });

  it("should make a success callback after authentication", async () => {
    const res = await request(app).get(testCallbackUrl);
    expect(res.status).toBe(200);
  });

  it("should return a 401 response", async () => {
    testFlags.disableTwitter = true;

    const res = await request(app).get("/social/twitter");
    expect(res.status).toBe(401);
  });
});
