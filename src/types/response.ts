export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string; // "bot"
  token_type: string; // "Bearer"
}


/**
 * API 에러 응답 인터페이스
 * @interface ErrorResponse
 */
export interface ErrorResponse {
  code: string;
  description: string;
}