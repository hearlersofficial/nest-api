export enum CounselStage {
  UNSPECIFIED = 0,
  SMALL_TALK = 1, //스몰토크, 컨디션 진단
  POSITIVE = 2, //긍정
  NEGATIVE_WITH_REASON = 3, //부정(이유 O)
  NEGATIVE_WITHOUT_REASON = 4, //부정(이유 X)
  EXTREME = 5, //극단적
}
