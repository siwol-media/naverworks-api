export interface Action {
  action?: PostbackAction | MessageAction | UriAction | CameraAction | CameraRollAction | LocationAction | CopyAction;
}

interface Label {
  /** 
   * 항목에 표시되는 레이블
   * - 리치 메뉴와 캐러셀의 'defaultAction' 항목을 제외하고 필수값
   * - 리치 메뉴는 값을 지정하지 않으면 데스크톱 환경에서 기본 메시지가 출력됨
   * - 기본 최대 글자수: 20자
   * - 이미지 캐러셀 최대 글자수: 12자
   * - 고정 메뉴 최대 글자수: 1000자
   */
  label?: string;
}

/**
 * Postback 액션 인터페이스
 * 이 액션과 관련된 항목을 누르면 data 파라미터에 지정된 문자열이 포함된 Postback Event가 Callback으로 반환됩니다.
 * 
 * 참고: 각 액션별로 사용 가능한 위치가 제한됩니다. 자세한 내용은 액션목록의 표를 참고하세요.
 */
interface PostbackAction extends Label {
  /** 액션 타입 (postback으로 고정) */
  type: "postback";
  /** 
   * postback.data 속성의 callback을 통해 반환되는 문자열
   * - 필수값
   * - 최대 글자수: 300자
   * 
   * @example
   * data: "action=buy&itemId=1234"
   */
  data: string;
  /** 
   * 사용자가 보낸 메시지로 채팅에 표시되는 텍스트
   * - 입력하지 않으면 텍스트가 표시되지 않음
   * - Quick Reply에서는 필수값
   * - 최대 글자수: 300자
   */
  displayText?: string;
}

/**
 * Message 액션 인터페이스
 * 이 액션과 관련된 항목을 누르면 text 속성의 문자열이 메시지로 전송되고 Message Event가 Callback으로 전송됩니다.
 * 
 * 참고: 각 액션별로 사용 가능한 위치가 제한됩니다. 자세한 내용은 액션목록의 표를 참고하세요.
 */
interface MessageAction extends Label {
  /** 액션 타입 (message로 고정) */
  type: "message";
  /** 
   * 항목을 누를 때 전송되는 텍스트
   * - 캐러셀, 이미지 캐러셀, 리치 메뉴, Quick Reply에서 필수값
   * - 버튼 템플릿, 리스트 템플릿, 고정 메뉴에서는 label값으로 대체됨
   * - 최대 글자수: 300자
   */
  text?: string;
  /** 
   * message.postback 속성으로 반환되는 문자열
   * - 최대 글자수: 1000자
   */
  postback?: string;
}

/**
 * URI 액션 인터페이스
 * 이 액션과 관련된 항목을 누르면 uri 속성에 지정된 URI가 열립니다.
 * 
 * 참고: 각 액션별로 사용 가능한 위치가 제한됩니다. 자세한 내용은 액션목록의 표를 참고하세요.
 */
interface UriAction {
  /** 액션 타입 (uri로 고정) */
  type: "uri";
  /** 
   * 항목에 표시되는 레이블
   * - 리치 메뉴와 캐러셀의 'defaultAction' 항목을 제외하고 필수값
   * - 리치 메뉴는 값을 지정하지 않으면 데스크톱 환경에서 기본 메시지가 출력됨
   * - 기본 최대 글자수: 20자
   * - 이미지 캐러셀 최대 글자수: 12자
   * - 고정 메뉴 최대 글자수: 1000자
   */
  label?: string;
  /** 
   * 항목을 누를 때 열리는 URI
   * - 필수값
   * - 'http', 'https' 스키마를 지원
   * - 최대 글자수: 1000자
   */
  uri: string;
}

/**
 * 카메라 액션 인터페이스
 * 이 액션이 지정된 버튼을 누르면 카메라 화면이 열립니다.
 * 
 * 참고: 
 * - 모바일 버전에서만 사용할 수 있습니다.
 */
interface CameraAction extends Label {
  /** 액션 타입 (camera로 고정) */
  type: "camera";
}

/**
 * 카메라 롤 액션 인터페이스
 * 이 액션이 지정된 버튼을 누르면 카메라 롤 화면이 열립니다.
 * 
 * 참고: 
 * - 모바일 버전에서만 사용할 수 있습니다.
 */
interface CameraRollAction extends Label {
  /** 액션 타입 (cameraRoll로 고정) */
  type: "cameraRoll";
}

/**
 * 위치 액션 인터페이스
 * 이 액션이 지정된 버튼을 누르면 위치 정보 화면이 열린다.
 * 
 * 참고: 
 * - 모바일 버전에서만 사용할 수 있습니다.
 */
interface LocationAction extends Label {
  /** 액션 타입 (location로 고정) */
  type: "location";
}

/**
 * 복사 액션 인터페이스
 * 이 액션이 지정된 버튼을 누르면 copyText 파라미터에 지정된 텍스트가 클립보드에 복사됩니다.
 * 
 * 참고: 
 * - 이 액션은 v3.6부터 지원됩니다.
 */
interface CopyAction extends Label {
  /** 액션 타입 (copy로 고정) */
  type: "copy";
  /** 
   * 항목을 누를 때 클립보드로 복사되는 텍스트
   * - 필수값
   * - 최대 글자수: 1000자
   */
  copyText: string;
}