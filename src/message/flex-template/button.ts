import type { Action, Color, Flex, Margin, Offset, VerticalAlign } from "./common";

export interface ButtonComponent extends Offset, VerticalAlign, Margin, Color, Action, Flex {
  type: "button";
  style?: "link" | "primary" | "secondary";
  height?: "sm" | "md";
}