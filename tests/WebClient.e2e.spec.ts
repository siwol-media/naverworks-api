import { describe, it, expect, beforeAll } from "vitest";
import { WebClient } from "../src/WebClient";
import { ApiConfiguration } from "../src/config";
import "dotenv/config";
import { AxiosError } from "axios";

describe("WebClient E2E", () => {
  let client: WebClient;
  const config: ApiConfiguration = {
    clientId: process.env.NAVERWORKS_CLIENT_ID!,
    clientSecret: process.env.NAVERWORKS_CLIENT_SECRET!,
    serviceAccount: process.env.NAVERWORKS_SERVICE_ACCOUNT!,
    botNo: parseInt(process.env.NAVERWORKS_BOT_NO!),
    channelId: process.env.NAVERWORKS_CHANNEL_ID!,
    privateKey: process.env.NAVERWORKS_PRIVATE_KEY!
  };

  beforeAll(async () => {
    client = new WebClient(config);
    await client.initialize();
  });

  describe("sendMessage", () => {
    it("should send message to actual Naver Works API", async () => {
      const message = {
        content: {
          type: "text",
          text: "E2E 테스트 메시지입니다. " + new Date().toISOString()
        }
      };

      const response = await client.sendMessage(message);

      // 2xx 상태 코드는 모두 성공으로 간주
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      expect(response.data).toBeDefined();
    });

    it("should handle invalid message format", async () => {
      const invalidMessage = {
        content: {
          type: "invalid_type",
          text: "잘못된 형식의 메시지"
        }
      };

      await expect(client.sendMessage(invalidMessage)).rejects.toThrow();
    });
  });
}); 