// export enum CounselorType {
//   DAHYE = 0, //다혜
//   JIHWAN = 1, //지환
//   ELLIE = 2, //엘리
//   YOON = 3, //윤
//   CHERRY = 4, //체리
//   ADEN = 5, //에이든
//   HIKO = 6, //히코
//   ARU = 7, //아루
// }

// export const CounselorInfo = {
//   [CounselorType.DAHYE]: {
//     name: "다혜",
//     gender: "female",
//     type: "우울",
//   },
//   [CounselorType.JIHWAN]: {
//     name: "지환",
//     gender: "male",
//     type: "우울",
//   },
//   [CounselorType.ELLIE]: {
//     name: "엘리",
//     gender: "female",
//     type: "불안",
//   },
//   [CounselorType.YOON]: {
//     name: "윤",
//     gender: "male",
//     type: "불안",
//   },
//   [CounselorType.CHERRY]: {
//     name: "체리",
//     gender: "female",
//     type: "무기력",
//   },
//   [CounselorType.ADEN]: {
//     name: "에이든",
//     gender: "male",
//     type: "무기력",
//   },
//   [CounselorType.HIKO]: {
//     name: "히코",
//     gender: "female",
//     type: "외로움",
//   },
//   [CounselorType.ARU]: {
//     name: "아루",
//     gender: "male",
//     type: "외로움",
//   },
// };

export enum CounselorType {
  UNSPECIFIED = 0,
  DEPRESSED = 1, //우울
  ANXIOUS = 2, //불안
  TIRED = 3, //무기력
  LONELY = 4, //외로움
}
