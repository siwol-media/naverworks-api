import { AccessTokenProvider } from "./providers";
import { DirectTokenProvider } from "./providers/direct";
import { ClientConfiguration, Message, ErrorResponse } from "./types";
import axios, { AxiosError } from "axios";

/**
 * 네이버 웍스 API 클라이언트 구현체
 * @class WebClient
 * 
 * @example
 * const tokenProvider = new DirectTokenProvider(config);
 * const client = new WebClient(config, tokenProvider);
 * 
 * ⚠️ 주의: 여러 인스턴스가 동시에 생성될 경우 토큰이 중복 발급될 수 있습니다.
 * 토큰이 새로 발급되면 기존 토큰은 효력을 잃습니다.
 * 가능하면 토큰 프로바이더를 사용하여 토큰을 공유하는 것을 권장합니다.
 */
export class WebClient {
  
  /**
   * @param {ClientConfiguration} config - API 설정 정보
   * @param {AccessTokenProvider} tokenProvider - 액세스 토큰 제공자
   */
  constructor(private config: ClientConfiguration, private tokenProvider: AccessTokenProvider) { }

  /**
   * 메시지를 네이버웍스 봇 채널로 전송합니다.
   *
   * @param {Message} message - 전송할 메시지 객체
   * @param {Object} [options] - 채널 및 봇 설정을 오버라이드할 수 있는 옵션
   * @param {string} [options.channelId] - 기본 설정을 대체할 채널 ID
   * @param {number} [options.botNo] - 기본 설정을 대체할 봇 번호
   * @returns {Promise<any>} 네이버웍스 API 응답 객체
   * @throws {Error} 메시지 전송 실패 시 오류가 발생합니다. (예: 인증 오류, 형식 오류 등)
   *
   * @example
   * await client.sendMessage(message); // 기본 설정 사용
   * await client.sendMessage(message, { channelId: 'xxx', botNo: 123 }); // 동적 전송
   */
  public async sendMessage(message: Message, options?: {
    channelId?: string;
    botNo?: number;
  }) {
    try {
      const accessToken = await this.tokenProvider.getToken();

      const channelId = options?.channelId ?? this.config.channelId;
      const botNo = options?.botNo ?? this.config.botNo;

      const response = await axios.post(`https://www.worksapis.com/v1.0/bots/${botNo}/channels/${channelId}/messages`, message, { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } });

      if (response.status >= 400) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        const data = error.response?.data as ErrorResponse;

        throw new Error(`${data.code}: ${data.description}`);
      }

      throw error;
    }
  }
}