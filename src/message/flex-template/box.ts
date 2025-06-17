import type { Flex, Margin, Offset, SpacingScale } from "./common";
import type { ButtonComponent } from "./button";
import type { Filter } from "./filter";
import type { IconComponent } from "./icon";
import type { ImageComponent } from "./image";
import type { Separator } from "./seperator";
import type { TextComponent } from "./text";
import type { Action } from "./action";

export type FlexComponent = Box | ButtonComponent | ImageComponent | IconComponent | TextComponent | Separator | Filter;

export type Box = DirectionBox | BaselineBox;

interface DirectionBox extends BoxBase {
  layout: "horizontal" | "vertical";
  contents: Exclude<FlexComponent, IconComponent>[];
}

interface BaselineBox extends BoxBase {
  layout: "baseline";
  contents: Exclude<FlexComponent, ButtonComponent | ImageComponent | Separator>[];
}

/**
 * 박스 컴포넌트의 인터페이스
 * 여러 컴포넌트를 배치하는 컨테이너 역할을 하는 컴포넌트입니다.
 */
interface BoxBase extends Action, Flex, Margin, Offset {
  /** 컴포넌트 타입 (box로 고정) */
  type: "box";
  /** 
   * 박스에서 컴포넌트를 배치하는 방향
   * - horizontal/vertical: box, button, image, text, separator, filler 컴포넌트 사용 가능
   * - baseline: icon, text, filler 컴포넌트만 사용 가능
   */
  layout: "horizontal" | "vertical" | "baseline";
  /** 
   * 박스의 컴포넌트
   * 하위에 추가된 컴포넌트는 배열에 지정된 순서에 따라 표시됨
   */
  contents: FlexComponent[];
  /** 
   * 블록의 배경색
   * - RGB 색상 외에 알파 채널(투명도)도 설정 가능
   * - Hex 색상 코드로 지정 (예: #RRGGBBAA)
   * - 기본값: #00000000
   */
  backgroundColor?: string;
  /** 
   * 박스의 테두리 색상
   * - Hex 색상 코드로 지정
   */
  borderColor?: string;
  /** 
   * 박스 테두리의 두께
   * - 픽셀값 직접 입력 또는 none, light, normal, medium, semi-bold, bold 중 하나
   * - none: 테두리 미표시
   * - 나머지 값들은 열거된 순으로 테두리 두께가 두꺼워짐
   */
  borderWidth?: string;
  /** 
   * 테두리 모서리를 둥글게 설정
   * - 픽셀값 직접 입력 또는 none, xs, sm, md, lg, xl, xxl 중 하나
   * - none: 모서리 둥글게 설정 안 함
   * - 나머지 값들은 열거된 순으로 모서리를 더 둥글게 만듦
   * - 기본값: none
   */
  cornerRadius?: SpacingScale | string;
  /** 박스의 너비 */
  width?: string;
  /** 박스의 높이 */
  height?: string;
  /** 
   * 박스 내 컴포넌트들 사이의 최소 간격
   * - 기본값: none
   */
  spacing?: SpacingScale;
  /** 
   * 박스 테두리와 해당 박스에 추가된 컴포넌트 사이의 간격
   */
  paddingAll?: SpacingScale | string;
  /** 
   * 박스 위쪽 테두리와 해당 박스에 추가된 컴포넌트 위쪽 테두리 사이의 간격
   */
  paddingTop?: SpacingScale | string;
  /** 
   * 박스 아래쪽 테두리와 해당 박스에 추가된 컴포넌트 아래쪽 테두리 사이의 간격
   */
  paddingBottom?: SpacingScale | string;
  /** 
   * 박스 왼쪽 테두리와 해당 박스에 추가된 컴포넌트 왼쪽 테두리 사이의 간격
   */
  paddingStart?: SpacingScale | string;
  /** 
   * 박스 오른쪽 테두리와 해당 박스에 추가된 컴포넌트 오른쪽 테두리 사이의 간격
   */
  paddingEnd?: SpacingScale | string;
}
