import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/Counsels.entity";
import { CounselState, jsonbTransformer, zCounselState } from "~common/system/persistences/validators/fsm.schemas";
import { Column, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";

@Entity({ name: "counsel_contexts", comment: "상담 세션 런타임 컨텍스트(FSM)" })
export class CounselContextsEntity extends CoreEntity {
  @Column({
    type: "int",
    name: "current_technique_msg_count",
    default: 0,
    comment: "현 기법에서 누적 메시지 수(>=0)",
  })
  currentTechniqueMsgCount!: number;

  @Column({
    type: "jsonb",
    name: "counsel_state",
    default: () => "'{}'::jsonb",
    comment: "기법 독립적 지속 컨텍스트(모르면 null 허용)",
    transformer: jsonbTransformer<CounselState>(zCounselState),
  })
  counselState!: CounselState;

  @Column({
    type: "timestamp",
    name: "state_entered_at",
    nullable: true,
    comment: "현 상태 진입 시각",
  })
  stateEnteredAt!: string | null;

  @OneToOne(() => CounselsEntity, (counsel) => counsel.counselContext, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "counsel_id" })
  counsel!: CounselsEntity;

  @RelationId((ctx: CounselContextsEntity) => ctx.counsel)
  @Column({ type: "bigint", name: "counsel_id" })
  counselId!: string;
}
