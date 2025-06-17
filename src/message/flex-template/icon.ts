import { Margin, Offset, Size } from "./common";

/**
 * 아이콘 컴포넌트의 인터페이스
 * 이미지 URL을 통해 아이콘을 표시하는 컴포넌트입니다.
 */
export interface IconComponent extends Offset, Margin, Size {
  /** 컴포넌트 타입 (icon으로 고정) */
  type: "icon";
  /** 
   * 이미지 URL
   * - PNG 형식 권장
   * - HTTPS만 허용
   * - 최대 크기: 1MB
   * - 최대 글자수: 1,000자
   */
  url: string;
  /** 
   * 아이콘의 비율
   * - {width}:{height} 형식으로 지정
   * - width와 height는 1~10000 사이의 값
   * - height는 width의 3배를 초과할 수 없음
   * - 기본값: 1:1
   */
  aspectRatio?: string;
}