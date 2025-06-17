import type { FlexMessage } from "./flex-template";
import type { ImageMessage } from "./image";
import type { TextMessage } from "./text";

export interface Message {
  content: TextMessage | ImageMessage | FlexMessage;
}

export * from "./flex-template";
export * from "./image";
export * from "./text";