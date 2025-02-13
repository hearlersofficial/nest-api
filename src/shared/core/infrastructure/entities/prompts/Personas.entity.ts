import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/Counselors.entity";

import { Column, Entity, ManyToOne, RelationId } from "typeorm";

@Entity({ name: "personas", comment: "페르소나" })
export class PersonasEntity extends CoreEntity {
  @Column({ type: "text", name: "body" })
  body: string;

  @RelationId((personas: PersonasEntity) => personas.counselor)
  @Column({ type: "bigint", name: "counselor_id" })
  counselorId: string;

  @ManyToOne(() => CounselorsEntity, (counselor) => counselor.persona)
  counselor: CounselorsEntity;
}
