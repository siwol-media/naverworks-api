import { Box } from "./box";
import { Action } from "./common";

export interface Bubble extends Action {
  type: "bubble";
  /** 버블의 크기 (기본값: mega) */
  size?: "nano" | "micro" | "kilo" | "mega" | "giga";
  /** 문자열의 방향이며, 수평 박스에서는 하위 컴포넌트들이 배치되는 방향이다. (기본값: ltr) */
  direction?: "ltr" | "rtl";
  header?: Box;
  body?: Box;
  footer?: Box;
  styles?: BubbleStyles;
}

/**
 * 버블 컴포넌트의 스타일 인터페이스
 * 각 블록(header, hero, body, footer)의 스타일을 지정합니다.
 */
export interface BubbleStyles {
  /** 헤더 블록의 스타일 */
  header?: BlockStyle;
  /** 히어로 블록의 스타일 */
  hero?: BlockStyle;
  /** 바디 블록의 스타일 */
  body?: BlockStyle;
  /** 푸터 블록의 스타일 */
  footer?: BlockStyle;
}

/**
 * 블록 스타일 인터페이스
 * 각 블록의 배경색과 구분선 스타일을 지정합니다.
 */
export interface BlockStyle {
  /** 
   * 블록의 배경색
   * - Hex 색상 코드로 지정
   */
  backgroundColor?: string;
  /** 
   * 블록 위에 구분선 표시 여부
   * - true로 설정하면 블록 위에 구분선이 표시됨
   * - 기본값: false
   */
  separator?: boolean;
  /** 
   * 구분선의 색상
   * - Hex 색상 코드로 지정
   */
  separatorColor?: string;
}