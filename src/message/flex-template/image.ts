import { Action, HorizontalAlign, Margin, Offset, Size, VerticalAlign } from "./common";

/**
 * 이미지 컴포넌트의 인터페이스
 * 이미지 URL을 통해 이미지를 표시하는 컴포넌트입니다.
 */
export interface ImageComponent extends Offset, Margin, Size, HorizontalAlign, VerticalAlign, Action {
  /** 컴포넌트 타입 (image로 고정) */
  type: "image";
  /** 
   * 이미지 URL
   * - PNG 형식 권장
   * - HTTPS만 허용
   * - 최대 크기: 1MB
   * - 최대 글자수: 1,000자
   */
  url: string;
  /** 
   * 이미지의 비율
   * - {width}:{height} 형식으로 지정
   * - width와 height는 1~10000 사이의 값
   * - height는 width의 3배를 초과할 수 없음
   * - 기본값: 1:1
   */
  aspectRatio?: string;
  /** 
   * 이미지의 비율과 aspectRatio 속성에 지정한 비율이 일치하지 않을 때 이미지가 표시되는 방식
   */
  aspectMode?: "cover" | "fit";
}