import { AbstractTokenProvider } from ".";
import { RedisProviderConfiguration } from "../types";
import { createClient } from "redis";

/**
 * Redis를 사용하여 토큰 상태를 관리하는 토큰 프로바이더
 * @class RedisTokenProvider
 * 
 * @description
 * Redis를 사용하여 여러 서버에서 토큰을 공유할 수 있습니다.
 * 토큰의 만료 시간도 Redis에 저장되어 자동으로 관리됩니다.
 * 
 * @example
 * const provider = new RedisTokenProvider({
 *   clientId: "your-client-id",
 *   clientSecret: "your-client-secret",
 *   serviceAccount: "your-service-account",
 *   privateKey: "your-private-key"
 * });
 */
export class RedisTokenProvider extends AbstractTokenProvider {
  private readonly tokenKey: string;
  private readonly expiresAtKey: string;
  private redis: ReturnType<typeof createClient> | null = null;

  private redisUrl: string;

  constructor(config: RedisProviderConfiguration) {
    super(config);
    this.tokenKey = `naverworks:token:${config.clientId}`;
    this.expiresAtKey = `naverworks:token:${config.clientId}:expiresAt`;
    this.redisUrl = config.redisUrl;
  }

  /**
   * Redis 클라이언트를 초기화합니다.
   */
  private async initializeRedis() {
    if (!this.redis) {
      this.redis = await createClient({ url: this.redisUrl }).connect();
    }
  }

  /**
   * 유효한 액세스 토큰을 반환합니다.
   * Redis에서 토큰을 조회하고, 만료되었다면 새로운 토큰을 발급받습니다.
   * 
   * @returns {Promise<string>} 액세스 토큰
   * @throws {Error} 토큰 발급 실패 시 에러 발생
   */
  async getToken(): Promise<string> {
    await this.initializeRedis();

    if (!this.redis) {
      throw new Error("Redis client is not initialized");
    }

    const [token, expiresAt] = await Promise.all([
      this.redis.get(this.tokenKey),
      this.redis.get(this.expiresAtKey)
    ]);

    if (token && expiresAt && !this.isTokenExpired(Number(expiresAt))) {
      return token;
    }

    const { accessToken, accessTokenExpiresAt } = await this.getAccessToken();

    // Redis에 토큰 정보 저장
    await Promise.all([
      this.redis.set(this.tokenKey, accessToken),
      this.redis.set(this.expiresAtKey, accessTokenExpiresAt.toString())
    ]);

    return accessToken;
  }
}