import { ManyToOne } from "typeorm";
import { CounselorsEntity } from "~/src/shared/core/infrastructure/entities/Counselors.entity";

// TODO: 빼고 string으로 할지 테이블로 할지 결정
export class PersonasEntity {
  @ManyToOne(() => CounselorsEntity, (counselor) => counselor.persona)
  counselor: CounselorsEntity;
}
