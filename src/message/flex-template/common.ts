export interface HorizontalAlign {
  align?: "start" | "center" | "end";
};
export interface VerticalAlign {
  gravity?: "top" | "bottom" | "center";
};

interface OffsetMap {
  /** 
   * %(박스의 크기를 기준으로 한 비율) 또는 픽셀 단위로 값을 지정하거나, 
   * none, xs, sm, md, lg, xl, or xxl 중 하나의 값을 지정할 수 있다. 
   */
  offsetTop?: string;
  /** 
   * %(박스의 크기를 기준으로 한 비율) 또는 픽셀 단위로 값을 지정하거나, 
   * none, xs, sm, md, lg, xl, or xxl 중 하나의 값을 지정할 수 있다. 
   */
  offsetBottom?: string;
  /** 
   * %(박스의 크기를 기준으로 한 비율) 또는 픽셀 단위로 값을 지정하거나, 
   * none, xs, sm, md, lg, xl, or xxl 중 하나의 값을 지정할 수 있다. 
   */
  offsetStart?: string;
  /** 
   * %(박스의 크기를 기준으로 한 비율) 또는 픽셀 단위로 값을 지정하거나, 
   * none, xs, sm, md, lg, xl, or xxl 중 하나의 값을 지정할 수 있다. 
   */
  offsetEnd?: string;
};
export interface Offset extends OffsetMap { 
  /** offsetTop, offsetBottom, offsetStart, offsetEnd 속성의 기준 (기본값: relative) */
  position?: "relative" | "absolute"; 
}

export type SpacingScale = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export interface Margin {
  /** 
   * 상위 컴포넌트 내 해당 컴포넌트와 이전 컴포넌트와의 최소 간격
   * margin 속성은 상위 컴포넌트의 spacing 속성보다 우선한다.
   */
  margin?: SpacingScale;
}

export interface Size {
  /** 컴포넌트의 크기 (기본값: md) */
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl' | '4xl' | '5xl';
}

export interface Color {
  /** Hex 색상 코드로 지정 */
  color?: string;
}

export interface Flex {
  /** 상위 컴포넌트 내 해당 컴포넌트의 너비 또는 높이의 비율 */
  flex?: number;
}