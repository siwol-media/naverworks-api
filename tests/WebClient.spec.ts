import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { WebClient } from "../src/WebClient";
import { ApiConfiguration } from "../src/config";
import "dotenv/config";
import axios from "axios";

vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

describe("WebClient", () => {
  let client: WebClient;
  const mockConfig: ApiConfiguration = {
    clientId: process.env.NAVERWORKS_CLIENT_ID!,
    clientSecret: process.env.NAVERWORKS_CLIENT_SECRET!,
    serviceAccount: process.env.NAVERWORKS_SERVICE_ACCOUNT!,
    botNo: parseInt(process.env.NAVERWORKS_BOT_NO!),
    channelId: process.env.NAVERWORKS_CHANNEL_ID!,
    privateKey: process.env.NAVERWORKS_PRIVATE_KEY!
  };

  beforeEach(() => {
    client = new WebClient(mockConfig);
    vi.clearAllMocks();
  });

  describe("initialize", () => {
    it("should get access token successfully", async () => {
      const mockTokenResponse = {
        data: {
          access_token: "test-access-token"
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);

      const token = await client.initialize();
      
      expect(token).toBe("test-access-token");
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://auth.worksmobile.com/oauth2/v2.0/token",
        expect.any(String),
        expect.any(Object)
      );
    });

    it("should throw error when token request fails", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Token request failed"));

      await expect(client.initialize()).rejects.toThrow("Token request failed");
    });
  });

  describe("sendMessage", () => {
    const mockMessage = { content: { type: "text", text: "test message" } };

    beforeEach(async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: "test-access-token" }
      });
      await client.initialize();
    });

    it("should send message successfully", async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const response = await client.sendMessage(mockMessage);

      expect(response).toEqual(mockResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `https://www.worksapis.com/v1.0/bots/${mockConfig.botNo}/channels/${mockConfig.channelId}/messages`,
        mockMessage,
        {
          headers: {
            Authorization: "Bearer test-access-token",
            "Content-Type": "application/json"
          }
        }
      );
    });
  });
}); 