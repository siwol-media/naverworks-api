export interface ProviderConfiguration {
  clientId: string;
  clientSecret: string;
  serviceAccount: string;
  privateKey: string;
}

export interface RedisProviderConfiguration extends ProviderConfiguration {
  redisUrl: string;
}

export interface ClientConfiguration {
  botNo: number;
  channelId?: string;
}

