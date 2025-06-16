import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { RedisTokenProvider } from "../src/providers/redis";
import { RedisProviderConfiguration } from "../src/types";
import { createClient } from "redis";
import "dotenv/config";

// global fetch를 모킹
vi.spyOn(global, 'fetch').mockImplementation(() => {
  return Promise.resolve(new Response());
});

// redis createClient 모킹
vi.mock('redis', () => ({
  createClient: vi.fn()
}));

describe("RedisTokenProvider", () => {
  let provider: RedisTokenProvider;
  const mockConfig: RedisProviderConfiguration = {
    clientId: process.env.NAVERWORKS_CLIENT_ID!,
    clientSecret: process.env.NAVERWORKS_CLIENT_SECRET!,
    serviceAccount: process.env.NAVERWORKS_SERVICE_ACCOUNT!,
    privateKey: process.env.NAVERWORKS_PRIVATE_KEY!,
    redisUrl: process.env.REDIS_URL!
  };

  const mockRedisClient = {
    get: vi.fn(),
    set: vi.fn()
  };

  beforeEach(() => {
    (createClient as Mock).mockReturnValue({
      connect: vi.fn().mockResolvedValue(mockRedisClient)
    });
    
    provider = new RedisTokenProvider(mockConfig);
    vi.clearAllMocks();
  });

  describe("getToken", () => {
    it("should return cached token from Redis if not expired", async () => {
      const mockTokenResponse = {
        access_token: "test-access-token",
        expires_in: 3600
      };

      mockRedisClient.get
        .mockResolvedValueOnce("test-access-token")
        .mockResolvedValueOnce(Date.now() + 3600000);

      const token = await provider.getToken();
      expect(token).toBe("test-access-token");
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should get new token if Redis token is expired", async () => {
      const mockTokenResponse = {
        access_token: "test-access-token",
        expires_in: 3600
      };

      mockRedisClient.get
        .mockResolvedValueOnce("old-token")
        .mockResolvedValueOnce(Date.now() - 1000); // 만료된 토큰

      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockTokenResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      );

      const token = await provider.getToken();
      expect(token).toBe("test-access-token");
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.set).toHaveBeenCalledTimes(2);
    });

    it("should get new token if Redis token is not found", async () => {
      const mockTokenResponse = {
        access_token: "test-access-token",
        expires_in: 3600
      };

      mockRedisClient.get.mockResolvedValue(null);
      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockTokenResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      );

      const token = await provider.getToken();
      expect(token).toBe("test-access-token");
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.set).toHaveBeenCalledTimes(2);
    });

    it("should throw error when token request fails", async () => {
      mockRedisClient.get.mockResolvedValue(null);
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Token request failed"));

      await expect(provider.getToken()).rejects.toThrow("Token request failed");
    });
  });
});