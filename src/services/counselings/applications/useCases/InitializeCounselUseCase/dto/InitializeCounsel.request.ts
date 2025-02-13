<<<<<<< HEAD
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
=======
import { Counselors } from "~/src/aggregates/counselors/domain/counselors";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립)

export interface InitializeCounselUseCaseRequest {
  userId: UniqueEntityId;
  counselor: Counselors;
}
