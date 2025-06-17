import { Bubble } from "./bubble";

/**
 * @see https://developers.worksmobile.com/kr/docs/bot-send-flex
 */
export interface FlexMessage {
  type: "flex";
  altText: string;
  contents: FlexContainer;
}

export type FlexContainer = Carousel | Bubble;

/**
 * 캐러셀 컴포넌트의 인터페이스
 * 여러 개의 버블을 가로로 배치하여 표시하는 컴포넌트입니다.
 * 
 * 제약사항:
 * - 하나의 캐러셀에 너비가 서로 다른 버블을 추가할 수 없음 (size 속성)
 * - 하나의 캐러셀에 추가된 버블들의 너비는 모두 동일해야 함
 * - 하나의 캐러셀에 포함된 모든 버블의 높이는 가장 높은 버블의 높이에 맞춰 늘어남
 * - 단, 바디(body)가 없는 버블은 높이가 변하지 않음
 */
export interface Carousel {
  type: "carousel";
  /** 캐러셀 내 버블 컴포넌트 수 (최대 10개) */
  contents: Bubble[];
}

export * from "./box";
export * from "./bubble";
export * from "./button";
export * from "./filter";
export * from "./icon";
export * from "./image";
export * from "./seperator";
export * from "./text";