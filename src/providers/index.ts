import { JWTClaimSet, JWTHeader, ProviderConfiguration, TokenResponse } from "../types";
import * as jose from "jose";
import axios from "axios";

const BUFFER_TIME = 30_000; // 30 s


/**
 * 네이버 웍스 API의 액세스 토큰을 제공하는 인터페이스
 * @interface AccessTokenProvider
 */
export interface AccessTokenProvider {
  getToken(): Promise<string>;
}

export abstract class AbstractTokenProvider implements AccessTokenProvider {
  constructor(private config: ProviderConfiguration) {}

  /**
   * 유효한 액세스 토큰을 반환합니다.
   * @returns {Promise<string>} 액세스 토큰
   */
  abstract getToken(): Promise<string>;

  private async createJWT() {
    const now = Math.floor(Date.now() / 1000);
    const claimSet: JWTClaimSet = {
      iss: this.config.clientId,
      sub: this.config.serviceAccount,
      iat: now,
      exp: now + 60 * 60,
    };
    const privateKeyObject = await jose.importPKCS8(this.config.privateKey, "RS256");
    const signature = await new jose.SignJWT(claimSet).setProtectedHeader(JWTHeader).sign(privateKeyObject);

    return signature;
  }

  protected async getAccessToken() {
    const jwt = await this.createJWT();

    const params = new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      scope: "bot",
    });

    const response = await axios.post("https://auth.worksmobile.com/oauth2/v2.0/token", params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, expires_in, refresh_token, scope, token_type } = response.data as TokenResponse;

    const accessTokenExpiresAt = Date.now() + (expires_in * 1000) - BUFFER_TIME;

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      accessTokenExpiresAt,
    };
  }

  protected isTokenExpired(expiresAt: number) {
    return Date.now() >= expiresAt;
  }
}