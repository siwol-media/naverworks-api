import type { Color, Flex, Margin, Offset, VerticalAlign } from "./common";
import type { Action } from "./action";

export interface ButtonComponent extends Offset, VerticalAlign, Margin, Color, Action, Flex {
  type: "button";
  style?: "link" | "primary" | "secondary";
  height?: "sm" | "md";
}