/** @type {import("prettier").Config} */
module.exports = {
  semi: true, // 세미콜론 필수
  singleQuote: false, // 쌍따옴표 사용
  printWidth: 120, // 코드 라인 최대 길이 (Nest 코드에 적당)
  tabWidth: 2, // 탭 너비
  trailingComma: "all", // 가능하면 항상 쉼표 사용 (객체, 배열, 함수 매개변수 등)
  bracketSpacing: true, // 객체 리터럴 중괄호 사이에 공백 유지 { a: 1 }
  arrowParens: "always", // 화살표 함수 매개변수 괄호 항상 사용
  endOfLine: "auto", // OS에 따라 줄 끝 자동 처리
  proseWrap: "preserve", // 마크다운 등 텍스트 감싸기 자동 비활성화
  parser: "typescript",
};
