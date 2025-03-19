import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/counsels/Counselors.entity";

import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({
  name: "personas",
  comment: "페르소나",
})
export class PersonaEntity extends CoreEntity {
  @Column({
    type: "text",
    name: "body",
    comment: "본문",
  })
  body: string;

  @ManyToOne(() => CounselorsEntity, (counselor) => counselor.personas)
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorsEntity;

  @RelationId((persona: PersonaEntity) => persona.counselor)
  @Column({ type: "bigint", name: "counselor_id" })
  counselorId: string;
}
