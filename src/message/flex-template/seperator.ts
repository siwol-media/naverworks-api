import { Color, Margin } from "./common";

/**
 * 박스 컴포넌트 내에서 구분선을 표시하는 컴포넌트입니다.
 * - 수평 박스(horizontal box)에서는 수직선으로 표시
 * - 수직 박스(vertical box)에서는 수평선으로 표시
 */
export interface Separator extends Margin, Color {
  /** 컴포넌트 타입 (separator로 고정) */
  type: "separator";
}
