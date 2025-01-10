import { WebClient } from "../src/WebClient";

describe("Naver Works API", () => {
  let client: WebClient;

  beforeAll(() => {
    client = new WebClient({});
  });

  it("get access token", async () => {
    const accessToken = await client.initialize();

    expect(accessToken).toBeDefined();
  });

  // it("test refresh token", async () => {
  //   const params = new URLSearchParams({
  //     grant_type: "refresh_token",
  //     refresh_token: refreshToken,
  //     client_id: _config.clientId,
  //     client_secret: _config.clientSecret,
  //   });

  //   const response = await axios.post("https://auth.worksmobile.com/oauth2/v2.0/token", params.toString(), {
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   });

  //   expect(response.status).toBe(200);
  //   expect(response.data.access_token).toBeDefined();
  //   expect(response.data.refresh_token).toBeDefined();

  //   accessToken = response.data.access_token;
  //   refreshToken = response.data.refresh_token;
  // });
});
