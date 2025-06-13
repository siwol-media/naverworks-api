import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { RedisTokenProvider } from "../src/providers/redis";
import { RedisProviderConfiguration } from "../src/types";
import { createClient } from "redis";
import "dotenv/config";
import axios from "axios";

vi.mock("axios");
vi.mock("redis");
const mockedAxios = axios as Mocked<typeof axios>;

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
    vi.mocked(createClient).mockReturnValue({
      connect: vi.fn().mockResolvedValue(mockRedisClient)
    } as any);
    
    provider = new RedisTokenProvider(mockConfig);
    vi.clearAllMocks();
  });

  describe("getToken", () => {
    it("should return cached token from Redis if not expired", async () => {
      const mockTokenResponse = {
        data: {
          access_token: "test-access-token",
          expires_in: 3600
        }
      };

      mockRedisClient.get
        .mockResolvedValueOnce("test-access-token")
        .mockResolvedValueOnce(Date.now() + 3600000);

      const token = await provider.getToken();
      expect(token).toBe("test-access-token");
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("should get new token if Redis token is expired", async () => {
      const mockTokenResponse = {
        data: {
          access_token: "test-access-token",
          expires_in: 3600
        }
      };

      mockRedisClient.get
        .mockResolvedValueOnce("old-token")
        .mockResolvedValueOnce(Date.now() - 1000); // 만료된 토큰

      mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);

      const token = await provider.getToken();
      expect(token).toBe("test-access-token");
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.set).toHaveBeenCalledTimes(2);
    });

    it("should get new token if Redis token is not found", async () => {
      const mockTokenResponse = {
        data: {
          access_token: "test-access-token",
          expires_in: 3600
        }
      };

      mockRedisClient.get.mockResolvedValue(null);
      mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);

      const token = await provider.getToken();
      expect(token).toBe("test-access-token");
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.set).toHaveBeenCalledTimes(2);
    });

    it("should throw error when token request fails", async () => {
      mockRedisClient.get.mockResolvedValue(null);
      mockedAxios.post.mockRejectedValueOnce(new Error("Token request failed"));

      await expect(provider.getToken()).rejects.toThrow("Token request failed");
    });
  });
});