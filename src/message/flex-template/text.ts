import type { Color, Flex, HorizontalAlign, Margin, Offset, Size, VerticalAlign } from "./common";
import type { Action } from "./action";

/**
 * 텍스트의 두께
 * @property regular - 기본 두께
 * @property bold - 굵은 두께
 */
type TextWeight = 'regular' | 'bold';

/**
 * 텍스트의 스타일
 * @property normal - 기본 스타일
 * @property italic - 기울임꼴
 */
type TextStyle = 'normal' | 'italic';

/**
 * 텍스트의 장식
 * @property none - 장식 없음
 * @property underline - 밑줄
 * @property line-through - 취소선
 */
type TextDecoration = 'none' | 'underline' | 'line-through';

/**
 * 텍스트 컴포넌트의 인터페이스
 * text 또는 contents 속성 중 하나를 반드시 지정해야 합니다.
 * contents 속성을 지정하면 text 속성은 무시됩니다.
 */
export interface TextComponent extends Offset, HorizontalAlign, VerticalAlign, Margin, Size, Color, Action, Flex {
  /** 컴포넌트 타입 (text로 고정) */
  type: 'text';
  /** 표시되는 문자열 (text 또는 contents 중 하나는 필수) */
  text: string;
  /** Span 컴포넌트 문자열 영역 (text 또는 contents 중 하나는 필수) */
  contents?: SpanComponent[];
  /** 문자열 줄 바꿈 처리 여부 (기본값: false) */
  wrap?: boolean;
  /** 문자열의 최대 행 개수 (wrap이 true일 때만 적용, 기본값: 0) */
  maxLines?: number;
  /** 문자열 두께 (기본값: regular) */
  weight?: TextWeight;
  /** 문자열 스타일 (기본값: normal) */
  style?: TextStyle;
  /** 텍스트 꾸미기 (기본값: none) */
  decoration?: TextDecoration;
}

/**
 * Span 컴포넌트의 인터페이스
 * 텍스트의 일부분에 대한 스타일을 지정할 때 사용됩니다.
 */
export interface SpanComponent extends Color, Size {
  /** 컴포넌트 타입 (span으로 고정) */
  type: 'span';
  /** 표시되는 문자열 */
  text: string;
  /** 문자열 두께 (기본값: regular) */
  weight?: TextWeight;
  /** 문자열 스타일 (기본값: normal) */
  style?: TextStyle;
  /** 텍스트 꾸미기 (기본값: none) */
  decoration?: TextDecoration;
}
