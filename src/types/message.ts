
export interface Message {
  content: TextMessage | ImageMessage | FlexMessage;
}

export interface TextMessage {
  type: "text";
  text: string;
}

export interface ImageMessage {
  type: "image";
  previewImageUrl?: string;
  originalContentUrl?: string;
  fileId?: string;
}

/**
 * @see https://developers.worksmobile.com/kr/docs/bot-send-flex
 */
export interface FlexMessage {
  type: "flex";
  altText: string;
  contents: FlexContainer;
}

export type FlexContainer = Carousel | Bubble;

export interface Carousel {
  type: "carousel";
  contents: Bubble[];
}

export interface Bubble {
  type: "bubble";
  size?: "nano" | "micro" | "kilo" | "mega" | "giga";
  header?: Box;
  body?: Box;
  footer?: Box;
  styles?: object;
}

export interface Box {
  type: "box";
  layout: "horizontal" | "vertical" | "baseline";
  contents: FlexComponent[];
  backgroundColor?: string;
  margin?: Spacing;
  width?: string;
  alignItems?: "flex-start" | "center" | "flex-end";
  paddingAll?: string;
}

export type FlexComponent = TextComponent | Box | IconComponent | ImageComponent | Spacer | ButtonComponent;

export interface TextComponent {
  type: "text";
  text: string;
  size?: string;
  color?: string;
  weight?: "regular" | "bold";
  flex?: number;
  wrap?: boolean;
  margin?: Spacing;
  decoration?: "none" | "underline" | "line-through";
  action?: Action;
}

export interface IconComponent {
  type: "icon";
  url: string;
  size?: string;
  margin?: Spacing;
}

export interface ImageComponent {
  type: "image";
  url: string;
  size?: string;
  aspectRatio?: string;
  aspectMode?: string;
  margin?: Spacing;
}

export interface Spacer {
  type: "spacer";
  size?: Spacing;
}

export interface ButtonComponent {
  type: "button";
  action: Action;
  style?: "link" | "primary" | "secondary";
  height?: "sm" | "md";
  color?: string;
  margin?: Spacing;
}

export interface Action {
  type: "uri" | "message" | "postback";
  label: string;
  uri?: string;
  text?: string;
  data?: string;
}

export type Spacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "3xl" | "4xl" | "5xl";