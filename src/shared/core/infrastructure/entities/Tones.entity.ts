import { Column, ManyToOne } from "typeorm";
import { CounselorsEntity } from "~/src/shared/core/infrastructure/entities/Counselors.entity";

export class ToneEntity {
  @Column({
    type: "string",
    name: "name",
    comment: "이름",
  })
  name: string;

  @Column({
    type: "string",
    name: "body",
    comment: "본문",
  })
  body: string;

  @ManyToOne(() => CounselorsEntity, (counselor) => counselor.tones)
  counselor: CounselorsEntity;
}
