import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/counselors/Counselors.entity";

import { Column, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";

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

  @OneToOne(() => CounselorsEntity, (counselor) => counselor.persona)
  @JoinColumn({ name: "counselor_id" })
  counselor: CounselorsEntity;

  @RelationId((persona: PersonaEntity) => persona.counselor)
  @Column({ type: "bigint", name: "counselor_id" })
  counselorId: string;
}
