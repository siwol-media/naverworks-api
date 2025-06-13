import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { DirectTokenProvider } from "../src/providers/direct";
import { ProviderConfiguration } from "../src/types";
import "dotenv/config";
import axios from "axios";

vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

describe("DirectTokenProvider", () => {
  let provider: DirectTokenProvider;
  const mockConfig: ProviderConfiguration = {
    clientId: process.env.NAVERWORKS_CLIENT_ID!,
    clientSecret: process.env.NAVERWORKS_CLIENT_SECRET!,
    serviceAccount: process.env.NAVERWORKS_SERVICE_ACCOUNT!,
    privateKey: process.env.NAVERWORKS_PRIVATE_KEY!
  };

  beforeEach(() => {
    provider = new DirectTokenProvider(mockConfig);
    vi.clearAllMocks();
  });

  describe("getToken", () => {
    it("should return cached token if not expired", async () => {
      const mockTokenResponse = {
        data: {
          access_token: "test-access-token",
          expires_in: 3600
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);

      // 첫 번째 호출: 토큰 발급
      const token1 = await provider.getToken();
      expect(token1).toBe("test-access-token");

      // 두 번째 호출: 캐시된 토큰 반환
      const token2 = await provider.getToken();
      expect(token2).toBe("test-access-token");
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it("should get new token if expired", async () => {
      const mockTokenResponse1 = {
        data: {
          access_token: "test-access-token-1",
          expires_in: 1 // 1초 후 만료
        }
      };
      const mockTokenResponse2 = {
        data: {
          access_token: "test-access-token-2",
          expires_in: 3600
        }
      };

      mockedAxios.post
        .mockResolvedValueOnce(mockTokenResponse1)
        .mockResolvedValueOnce(mockTokenResponse2);

      // 첫 번째 호출: 토큰 발급
      const token1 = await provider.getToken();
      expect(token1).toBe("test-access-token-1");

      // 만료 대기
      await new Promise(resolve => setTimeout(resolve, 1100));

      // 두 번째 호출: 새로운 토큰 발급
      const token2 = await provider.getToken();
      expect(token2).toBe("test-access-token-2");
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });

    it("should throw error when token request fails", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Token request failed"));

      await expect(provider.getToken()).rejects.toThrow("Token request failed");
    });
  });
});