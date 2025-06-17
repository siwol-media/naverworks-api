import { FlexMessage } from "./flex-template";
import { ImageMessage } from "./image";
import { TextMessage } from "./text";

export interface Message {
  content: TextMessage | ImageMessage | FlexMessage;
}

export * from "./flex-template";
export * from "./image";
export * from "./text";