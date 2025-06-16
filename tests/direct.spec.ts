import { describe, it, expect, beforeEach, vi } from "vitest";
import { DirectTokenProvider } from "../src/providers/direct";
import { ProviderConfiguration } from "../src/types";
import "dotenv/config";

// global fetch를 모킹
vi.spyOn(global, 'fetch').mockImplementation(() => {
  return Promise.resolve(new Response());
});

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
        access_token: "test-access-token",
        expires_in: 3600
      };

      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockTokenResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      );

      // 첫 번째 호출: 토큰 발급
      const token1 = await provider.getToken();
      expect(token1).toBe("test-access-token");

      // 두 번째 호출: 캐시된 토큰 반환
      const token2 = await provider.getToken();
      expect(token2).toBe("test-access-token");
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should get new token if expired", async () => {
      const mockTokenResponse1 = {
        access_token: "test-access-token-1",
        expires_in: 1 // 1초 후 만료
      };
      const mockTokenResponse2 = {
        access_token: "test-access-token-2",
        expires_in: 3600
      };

      vi.mocked(global.fetch)
        .mockResolvedValueOnce(new Response(JSON.stringify(mockTokenResponse1), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockTokenResponse2), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));

      // 첫 번째 호출: 토큰 발급
      const token1 = await provider.getToken();
      expect(token1).toBe("test-access-token-1");

      // 만료 대기
      await new Promise(resolve => setTimeout(resolve, 1100));

      // 두 번째 호출: 새로운 토큰 발급
      const token2 = await provider.getToken();
      expect(token2).toBe("test-access-token-2");
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should throw error when token request fails", async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Token request failed"));

      await expect(provider.getToken()).rejects.toThrow("Token request failed");
    });
  });
});