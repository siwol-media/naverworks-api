
export interface Message {
  content: TextMessage | ImageMessage | FlexMessage;
}

interface TextMessage {
  type: string; // "text";
  text: string;
}

interface ImageMessage {
  type: string; // "image";
  previewImageUrl?: string;
  originalContentUrl?: string;
  fileId?: string;
}

interface FlexMessage {
  type: string; // "flex";
  altText: string;
  contents: FlexContainer;
}

type FlexContainer = Carousel | Bubble;

interface Carousel {
  type: "carousel";
  contents: Bubble[];
}

interface Bubble {
  type: "bubble";
  size?: "nano" | "micro" | "kilo" | "mega" | "giga";
  header?: Box;
  body?: Box;
  footer?: Box;
  styles?: object;
}

interface Box {
  type: "box";
  layout: "horizontal" | "vertical" | "baseline";
  contents: FlexComponent[];
  backgroundColor?: string;
  margin?: Spacing;
  width?: string;
  alignItems?: "flex-start" | "center" | "flex-end";
  paddingAll?: string;
}

type FlexComponent = TextComponent | Box | IconComponent | ImageComponent | Spacer | ButtonComponent;

interface TextComponent {
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

interface IconComponent {
  type: "icon";
  url: string;
  size?: string;
  margin?: Spacing;
}

interface ImageComponent {
  type: "image";
  url: string;
  size?: string;
  aspectRatio?: string;
  aspectMode?: string;
  margin?: Spacing;
}

interface Spacer {
  type: "spacer";
  size?: Spacing;
}

interface ButtonComponent {
  type: "button";
  action: Action;
  style?: "link" | "primary" | "secondary";
  height?: "sm" | "md";
  color?: string;
  margin?: Spacing;
}

interface Action {
  type: "uri" | "message" | "postback";
  label: string;
  uri?: string;
  text?: string;
  data?: string;
}

type Spacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "3xl" | "4xl" | "5xl";