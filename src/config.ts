import { JWTPayload } from "jose";

export const JWTHeader = {
  alg: "RS256",
  typ: "JWT",
};

export interface JWTClaimSet extends JWTPayload {
  // clientId
  iss: string;
  // serviceAccount
  sub: string;
  // created at
  iat: number;
  // expired at (1 hour)
  exp: number;
}

export interface ApiConfiguration {
  clientId: string;
  clientSecret: string;
  serviceAccount: string;
  botNo: number;
  channelId: string;
  privateKey: string;
}
