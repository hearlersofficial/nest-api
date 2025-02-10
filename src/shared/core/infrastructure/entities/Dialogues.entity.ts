import { CounselorsEntity } from "~/src/shared/core/infrastructure/entities/Counselors.entity";
import { CounselsEntity } from "~/src/shared/core/infrastructure/entities/Counsels.entity";
import { UsersEntity } from "~/src/shared/core/infrastructure/entities/Users.entity";

export class DialogueEntity {
  counselor: CounselorsEntity;

  user: UsersEntity;

  rapport: number; // 안쓰는 값, 컷씬에 밖에 안씀, 프롬프트와는 무관하나 언제가는 페르소나 프롬프트에 영향을 줄 수 있음.

  counsels: CounselsEntity[];
}
