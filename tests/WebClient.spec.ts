import { describe, it, expect, beforeEach, vi } from "vitest";
import { WebClient } from "../src/WebClient";
import { ClientConfiguration } from "../src/types/config";
import { AccessTokenProvider } from "../src/providers/interface";
import { WebClientError } from "../src/errors/WebClientError";
import "dotenv/config";

// global fetch를 모킹
vi.spyOn(global, 'fetch').mockImplementation(() => {
  return Promise.resolve(new Response());
});

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
      const mockResponse = new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      const response = await client.sendMessage(mockMessage);

      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/bots/${mockConfig.botNo}/channels/${mockConfig.channelId}/messages`),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(mockMessage)
        })
      );
    });

    it("should send message with custom channel and bot", async () => {
      const mockResponse = new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

      const customOptions = {
        channelId: "custom-channel",
        botNo: 999
      };

      const response = await client.sendMessage(mockMessage, customOptions);

      expect(response).toEqual(mockResponse);
      expect(mockTokenProvider.getToken).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/bots/${customOptions.botNo}/channels/${customOptions.channelId}/messages`),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(mockMessage)
        })
      );
    });

    it("should handle API error response", async () => {
      const error = {
        code: "INVALID_MESSAGE",
        description: "Invalid message format"
      };

      // response 객체의 경우 .json()이나 .text() 한번 호출하면 재호출이 안된다.
      vi.mocked(global.fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify(error), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify(error), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }));

      await expect(client.sendMessage(mockMessage)).rejects.toThrow(WebClientError);
      await expect(client.sendMessage(mockMessage)).rejects.toMatchObject({
        message: error.description,
        code: error.code,
        statusCode: 400
      });
    });
  });
}); 