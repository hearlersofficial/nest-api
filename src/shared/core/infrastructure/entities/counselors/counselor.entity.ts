import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { BubbleEntity } from "~shared/core/infrastructure/entities/counselors/bubble.entity";
import { EpisodeEntity } from "~shared/core/infrastructure/entities/counselors/episode.entity";
import { ToneEntity } from "~shared/core/infrastructure/entities/counselors/tone.entity";
import { CounselorUserRelationshipsEntity } from "~shared/core/infrastructure/entities/counsels/CounselorUserRelationships.entity";
import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { CounselorScopedPromptEntity } from "~shared/core/infrastructure/entities/prompts/CounselorScopedPrompts.entity";
import { PersonaPromptEntity } from "~shared/core/infrastructure/entities/prompts/PersonaPrompts.entity";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counselor_pb";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";

@Entity({
  name: "counselors",
})
export class CounselorEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "name",
    comment: "상담사 이름",
  })
  name: string;

  @Column({
    type: "enum",
    name: "gender",
    enum: CounselorGender,
    comment: "성별",
  })
  gender: CounselorGender;

  @Column({
    type: "varchar",
    name: "description",
    comment: "상담사 소개",
  })
  description: string;

  @Column({
    type: "varchar",
    name: "profile_image",
    comment: "상담사 프로필 이미지",
    default: "",
  })
  profileImage: string;

  @ManyToOne(() => ToneEntity, (tone) => tone.counselors)
  @JoinColumn({ name: "tone_id" })
  tone: ToneEntity;

  @RelationId((counselor: CounselorEntity) => counselor.tone)
  @Column({
    type: "bigint",
    name: "tone_id",
    comment: "톤 ID",
  })
  toneId: string;

  @OneToMany(() => BubbleEntity, (bubble) => bubble.counselor, {
    cascade: true,
  })
  bubbles: BubbleEntity[];

  @OneToMany(() => EpisodeEntity, (episode) => episode.counselor, {
    cascade: true,
  })
  episodes: EpisodeEntity[];

  @OneToMany(() => PersonaPromptEntity, (personaPrompt) => personaPrompt.counselor, {
    cascade: true,
  })
  personaPrompts: PersonaPromptEntity[];

  @OneToMany(() => CounselorScopedPromptEntity, (counselorScopedPrompt) => counselorScopedPrompt.counselor, {
    cascade: true,
  })
  counselorScopedPrompts: CounselorScopedPromptEntity[];

  @OneToMany(() => CounselsEntity, (counsel) => counsel.counselor, {
    cascade: true,
  })
  counsels: CounselsEntity[];

  @OneToMany(
    () => CounselorUserRelationshipsEntity,
    (counselorUserRelationship) => counselorUserRelationship.counselor,
    {
      cascade: true,
    },
  )
  counselorUserRelationships: CounselorUserRelationshipsEntity[];
}
