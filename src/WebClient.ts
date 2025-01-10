import { ApiConfiguration, JWTClaimSet, JWTHeader } from "./config";
import * as jose from "jose";
import axios from "axios";

export class WebClient {
  private config: ApiConfiguration;
  private accessToken: string;

  private claimSet: JWTClaimSet;

  constructor(config: ApiConfiguration) {
    this.config = config;
    this.accessToken = "";
    this.claimSet = this.createClaimSet(this.config);
  }

  public async initialize() {
    this.accessToken = await this.getAccessToken();

    return this.accessToken;
  }

  public async sendMessage(message: any) {
    await this.ensureAccessToken();
    const config = this.config;
    const response = await axios.post(`https://www.worksapis.com/v1.0/bots/${config.botNo}/channels/${config.channelId}/messages`, message, { headers: { Authorization: `Bearer ${this.accessToken}`, "Content-Type": "application/json" } });

    return response;
  }

  private createClaimSet(config: ApiConfiguration) {
    return {
      iss: config.clientId,
      sub: config.serviceAccount,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
  }

  private async createJWT(config: ApiConfiguration) {
    const claimSet = this.claimSet;
    const privateKeyObject = await jose.importPKCS8(config.privateKey, "RS256");
    const signature = await new jose.SignJWT(claimSet).setProtectedHeader(JWTHeader).sign(privateKeyObject);

    return signature;
  }

  private async getAccessToken() {
    const config = this.config;

    const jwt = await this.createJWT(config);

    const params = new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: "bot",
    });

    const response = await axios.post("https://auth.worksmobile.com/oauth2/v2.0/token", params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  }

  private async ensureAccessToken() {
    if (!this.accessToken || this.isTokenExpired()) {
      this.accessToken = await this.getAccessToken();
    }
  }

  private isTokenExpired() {
    const claimSet = this.claimSet;

    return claimSet.exp < Math.floor(Date.now() / 1000);
  }
}
