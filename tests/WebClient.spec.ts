import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { WebClient } from "../src/WebClient";
import { ClientConfiguration } from "../src/types/config";
import { AccessTokenProvider } from "../src/providers";
import "dotenv/config";
import axios from "axios";

vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

describe("WebClient", () => {
  let client: WebClient;
  let mockTokenProvider: AccessTokenProvider;
  
  const mockConfig: ClientConfiguration = {
    botNo: parseInt(process.env.NAVERWORKS_BOT_NO!),
    channelId: process.env.NAVERWORKS_CHANNEL_ID!,
  };

  beforeEach(() => {
    // AccessTokenProvider 인터페이스를 모킹
    mockTokenProvider = {
      getToken: vi.fn().mockResolvedValue("test-access-token")
    };
    
    client = new WebClient(mockConfig, mockTokenProvider);
    vi.clearAllMocks();
  });

  describe("sendMessage", () => {
    const mockMessage = { content: { type: "text", text: "test message" } };

    it("should send message successfully", async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const response = await client.sendMessage(mockMessage);

      expect(response).toEqual(mockResponse);
      expect(mockTokenProvider.getToken).toHaveBeenCalled();
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

    it("should send message with custom channel and bot", async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const customOptions = {
        channelId: "custom-channel",
        botNo: 999
      };

      const response = await client.sendMessage(mockMessage, customOptions);

      expect(response).toEqual(mockResponse);
      expect(mockTokenProvider.getToken).toHaveBeenCalled();
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `https://www.worksapis.com/v1.0/bots/${customOptions.botNo}/channels/${customOptions.channelId}/messages`,
        mockMessage,
        {
          headers: {
            Authorization: "Bearer test-access-token",
            "Content-Type": "application/json"
          }
        }
      );
    });

    it("should handle API error response", async () => {
      const errorResponse = {
        code: "INVALID_MESSAGE",
        description: "Invalid message format"
      };

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: errorResponse
        }
      });

      await expect(client.sendMessage(mockMessage)).rejects.toThrow(
        `${errorResponse.code}: ${errorResponse.description}`
      );
    });
  });
}); 