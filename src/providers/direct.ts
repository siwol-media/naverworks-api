import { ProviderConfiguration } from "../types";
import { AbstractTokenProvider } from ".";

/**
 * 메모리에서 토큰 상태를 관리하는 토큰 프로바이더
 * @class DirectTokenProvider
 * 
 * @description
 * 한 서버에서만 사용하는 경우 문제가 없지만, 여러 서버에서 사용하는 경우 토큰 중복 발급이 발생할 수 있습니다.
 * 
 * @example
 * const provider = new DirectTokenProvider({
 *   clientId: "your-client-id",
 *   clientSecret: "your-client-secret",
 *   serviceAccount: "your-service-account",
 *   privateKey: "your-private-key"
 * });
 */
export class DirectTokenProvider extends AbstractTokenProvider {
  constructor(config: ProviderConfiguration) {
    super(config);
  }

  private accessToken: string | null = null;
  private accessTokenExpiresAt: number = 0;

  async getToken(): Promise<string> {
    if (!this.isTokenExpired(this.accessTokenExpiresAt) && this.accessToken) {
      return this.accessToken;
    }

    const { accessToken, accessTokenExpiresAt } = await this.getAccessToken();

    this.accessToken = accessToken;
    this.accessTokenExpiresAt = accessTokenExpiresAt;

    return accessToken;
  }
}